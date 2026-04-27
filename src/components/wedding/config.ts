import { useEffect, useState } from "react";

const COUPLE = { bride: "Venkatesan", groom: "Pavithra" };
const WEDDING_DATE = new Date("2026-05-18T06:00:00");

export const weddingConfig = {
  ...COUPLE,
  initials: "V & P",
  tagline: "Two hearts, one journey",
  date: WEDDING_DATE,
  weddingTime: "6:00 AM",
  receptionTime: "7:00 PM (17th May 2026)",
  venue: {
    name: "Rajamalar Thirumana Mahal",
    address: "Wandiwash, Tamil Nadu",
    mapsQuery: "Rajamalar+Thirumana+Mahal",
    mapsEmbedSrc:
      "https://www.google.com/maps?q=Rajamalar+Thirumana+Mahal&output=embed",
    mapsDirectionsUrl:
      "https://www.google.com/maps/place/Rajamalar+Thirumana+Mahal/@12.6511989,79.5395405,17z/data=!4m6!3m5!1s0x3a52d772fdc24689:0xdce97c813fcd6534!8m2!3d12.6527157!4d79.5401194!16s%2Fg%2F11gg6zz1g8",
  },
  // Backwards-compat aliases (some sections may still reference these)
  weddingVenue: {
    name: "Rajamalar Thirumana Mahal",
    address: "Wandiwash, Tamil Nadu",
    mapsQuery: "Rajamalar+Thirumana+Mahal",
  },
  receptionVenue: {
    name: "Rajamalar Thirumana Mahal",
    address: "Wandiwash, Tamil Nadu",
    mapsQuery: "Rajamalar+Thirumana+Mahal",
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
