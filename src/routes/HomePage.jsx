import Hero from "../components/Hero";
import RecentlyEvents from "../components/RecentlyEvents";

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <RecentlyEvents />
    </div>
  );
}
