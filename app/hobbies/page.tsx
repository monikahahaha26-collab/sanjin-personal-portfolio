import { OffDutyArchive } from "@/components/hobbies/OffDutyArchive";
import archive from "@/data/off-duty.json";

export const metadata = { title: "Off Duty" };

export default function HobbiesPage() {
  return <main className="archive-page"><div className="container"><OffDutyArchive {...archive} /></div></main>;
}
