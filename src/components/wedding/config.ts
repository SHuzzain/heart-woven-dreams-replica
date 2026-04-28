import { useEffect, useState } from "react";

const COUPLE = { bride: "Venkatesan", groom: "Pavithra" };
const WEDDING_DATE = new Date("2026-05-18T06:00:00");
const RECEPTION_DATE = new Date("2026-05-17T19:00:00");

export const weddingConfig = {
  ...COUPLE,
  initials: "V & P",
  tagline: "Two hearts, one journey",
  date: WEDDING_DATE,
  receptionDate: RECEPTION_DATE,
  weddingTime: "6:00 AM",
  receptionTime: "7:00 PM",
  venue: {
    name: "Rajamalar Thirumana Mahal",
    address: "MG3R+77W, Vallam Rd, Cheyyar, Tamil Nadu 604407",
    mapsQuery: "MG3R%2B77W+Vallam+Rd+Cheyyar+Tamil+Nadu+604407",
    mapsEmbedSrc:
      "https://www.google.com/maps?q=MG3R%2B77W+Vallam+Rd+Cheyyar+Tamil+Nadu+604407&output=embed",
    mapsDirectionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=MG3R%2B77W+Vallam+Rd+Cheyyar+Tamil+Nadu+604407",
  },
  // Backwards-compat aliases (some sections may still reference these)
  weddingVenue: {
    name: "Rajamalar Thirumana Mahal",
    address: "MG3R+77W, Vallam Rd, Cheyyar, Tamil Nadu 604407",
    mapsQuery: "MG3R%2B77W+Vallam+Rd+Cheyyar+Tamil+Nadu+604407",
  },
  receptionVenue: {
    name: "Rajamalar Thirumana Mahal",
    address: "MG3R+77W, Vallam Rd, Cheyyar, Tamil Nadu 604407",
    mapsQuery: "MG3R%2B77W+Vallam+Rd+Cheyyar+Tamil+Nadu+604407",
  },
  contactEmail: "venkatesanben0@gmail.com",
  contactPhone: "+91 9123505570",
};

export function useCountdown(target: Date) {
  const [time, setTime] = useState(() => calc(target));
  useEffect(() => {
    const id = setInterval(() => setTime(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function calc(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}
