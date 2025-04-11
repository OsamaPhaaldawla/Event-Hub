import background1 from "../assets/hero-1.jpg";
import background2 from "../assets/hero-2.webp";
import background3 from "../assets/hero-3.webp";
import background4 from "../assets/hero-4.webp";
import background5 from "../assets/hero-5.jpg";
import background6 from "../assets/hero-6.webp";

export function formatDate(date, time) {
  const newDate = new Date(date).toISOString().split("T")[0];
  let formattedDate = date;
  if (time) {
    formattedDate = new Date(newDate + "T" + time);
  }
  return formattedDate
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(",", " •");
}

export const eventTypes = [
  "Corporate Meeting",
  "Networking Event",
  "Startup Pitch Night",
  "Award Ceremony",
  "Conference & Summit",
  "Hackathon",
  "Tech Talk / Workshop",
  "Product Launch",
  "Theater & Performing Arts",
  "Art Exhibition",
  "Music Festival",
  "Movie Screening",
  "Book Fair & Literature Event",
  "Party & Celebration",
  "Wedding & Engagement",
  "Carnival & Fair",
  "Charity & Fundraising",
  "Workshop & Seminar",
  "University Event",
  "Personal Development Event",
  "Sports Tournament",
  "Fitness Bootcamp",
  "Marathon & Race",
  "Church & Religious Gathering",
  "Meditation & Mindfulness",
  "Food Festival",
  "Cooking Class",
  "Birthday Celebration",
  "Others",
];

export const heroDetails = [
  {
    id: 1,
    image: background1,
    title: "Your Next Big Opportunity Starts Here!",
    subtitle: "Discover conferences, networking events, and workshops.",
  },
  {
    id: 2,
    image: background2,
    title: "Build the Future, One Idea at a Time!",
    subtitle: "The ultimate platform for startups, developers, and creators.",
  },
  {
    id: 3,
    image: background3,
    title: "A Love Story Begins Here!",
    subtitle: "Find the perfect venue and make your dream wedding come true.",
  },
  {
    id: 4,
    image: background4,
    title: "Make a Wish & Celebrate!",
    subtitle: "Plan the perfect birthday celebration with friends and family.",
  },
  {
    id: 5,
    image: background5,
    title: "Graduation: The Beginning of Something Great!",
    subtitle: "Honor the hard work, memories, and future ahead.",
  },
  {
    id: 6,
    image: background6,
    title: "Lights, Music, Action!",
    subtitle: "Let the night take you where the music plays!",
  },
];
