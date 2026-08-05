const { withPodfile } = require("expo/config-plugins");

const GOOGLE_SIGN_IN_MODULAR_HEADERS = [
  "  # GoogleSignIn 9 pulls AppCheckCore, whose Objective-C dependencies",
  "  # need module maps when CocoaPods builds them as static libraries.",
  "  pod 'GoogleUtilities', :modular_headers => true",
  "  pod 'RecaptchaInterop', :modular_headers => true",
].join("\n");

module.exports = function withGoogleSignInModularHeaders(config) {
  return withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    if (
      podfile.includes("pod 'GoogleUtilities', :modular_headers => true") &&
      podfile.includes("pod 'RecaptchaInterop', :modular_headers => true")
    ) {
      return config;
    }

    const anchor = "  use_expo_modules!";

    if (!podfile.includes(anchor)) {
      throw new Error(
        "Could not add Google Sign-In modular headers: use_expo_modules! was not found in ios/Podfile.",
      );
    }

    config.modResults.contents = podfile.replace(
      anchor,
      `${anchor}\n\n${GOOGLE_SIGN_IN_MODULAR_HEADERS}`,
    );

    return config;
  });
};
