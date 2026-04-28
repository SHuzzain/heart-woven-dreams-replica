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
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.30802227389475!2d79.53997434780516!3d12.652702156384082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52d772fdc24689%3A0xdce97c813fcd6534!2sRajamalar%20Thirumana%20Mahal!5e0!3m2!1sen!2sin!4v1777382523982!5m2!1sen!2sin",
    mapsDirectionsUrl: "https://maps.app.goo.gl/4L7vQHfMc56jDRXd7",
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
