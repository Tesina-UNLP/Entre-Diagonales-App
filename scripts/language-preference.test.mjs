import assert from "node:assert/strict";
import test from "node:test";
import {
  languageFromDeviceCode,
  LanguagePreferenceState,
  localeFor,
  setDefaultAcceptLanguage,
} from "../libs/language-preference-core.ts";

function memoryStorage(initialValue = null) {
  let value = initialValue;
  return {
    get value() {
      return value;
    },
    async getItem() {
      return value;
    },
    async setItem(_key, nextValue) {
      value = nextValue;
    },
  };
}

test("maps supported device languages and falls back to Spanish", () => {
  assert.equal(languageFromDeviceCode("en"), "en");
  assert.equal(languageFromDeviceCode("pt"), "pt");
  assert.equal(languageFromDeviceCode("fr"), "es");
  assert.equal(languageFromDeviceCode(undefined), "es");
});

test("maps every app language to its API locale", () => {
  assert.equal(localeFor("es"), "es-AR");
  assert.equal(localeFor("en"), "en-US");
  assert.equal(localeFor("pt"), "pt-BR");
});

test("adds Accept-Language without replacing explicit or existing headers", () => {
  for (const locale of ["es-AR", "en-US", "pt-BR"]) {
    const headers = new Headers({
      Authorization: "Bearer token",
      "Content-Type": "application/json",
      "X-Correlation-Id": "correlation-id",
    });
    setDefaultAcceptLanguage(headers, locale);

    assert.equal(headers.get("Accept-Language"), locale);
    assert.equal(headers.get("Authorization"), "Bearer token");
    assert.equal(headers.get("Content-Type"), "application/json");
    assert.equal(headers.get("X-Correlation-Id"), "correlation-id");
  }

  const explicitHeaders = new Headers({ "Accept-Language": "fr-FR" });
  setDefaultAcceptLanguage(explicitHeaders, "es-AR");
  assert.equal(explicitHeaders.get("Accept-Language"), "fr-FR");
});

test("stored language wins and a session change persists for the next launch", async () => {
  const storage = memoryStorage("en");
  const firstLaunch = new LanguagePreferenceState({
    storageKey: "language",
    storage,
    initialLanguage: "es",
  });

  assert.equal(await firstLaunch.getLocale(), "en-US");
  const saving = firstLaunch.save("pt");
  assert.equal(await firstLaunch.getLocale(), "pt-BR");
  await saving;
  assert.equal(storage.value, "pt");

  const nextLaunch = new LanguagePreferenceState({
    storageKey: "language",
    storage,
    initialLanguage: "es",
  });
  assert.equal(await nextLaunch.getLocale(), "pt-BR");
});

test("a session change is not overwritten by an initial load in flight", async () => {
  let resolveStoredLanguage;
  const storage = {
    getItem: () =>
      new Promise((resolve) => {
        resolveStoredLanguage = resolve;
      }),
    setItem: async () => {},
  };
  const preference = new LanguagePreferenceState({
    storageKey: "language",
    storage,
    initialLanguage: "es",
  });

  const initializing = preference.initialize();
  const saving = preference.save("en");
  resolveStoredLanguage("pt");

  assert.equal(await initializing, "en");
  await saving;
  assert.equal(await preference.getLocale(), "en-US");
});
