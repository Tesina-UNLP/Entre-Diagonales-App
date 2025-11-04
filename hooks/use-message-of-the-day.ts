// message of the day hook title y description

import { useEffect, useState } from "react";

const messages = [
  {
    title: "¡Bienvenido a Entre Diagonales!",
    description: "Descubre nuevas aventuras y desafíos hoy.",
  },
  {
    title: "Consejo del día",
    description: "No olvides explorar cada rincón.",
  },
  {
    title: "Listo para explorar?",
    description: "¡Descubramos nuevos lugares hoy!",
  },
];

export function useMessageOfTheDay() {
  const [messageOfTheDay, setMessageOfTheDay] = useState(messages[0]);

  const refreshMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessageOfTheDay(messages[randomIndex]);
  };

  useEffect(() => {
    refreshMessage();
  }, []);

  return { messageOfTheDay, refreshMessage };
}
