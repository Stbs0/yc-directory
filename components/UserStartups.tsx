import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupCardType } from "./StartupCard";

export default async function UserStartups({ id }: { id: string }) {
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
console.log(startups)
  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup: StartupCardType) => {
          return <StartupCard
            key={startup._id}
            post={startup}
          />;
        })
      ) : (
        <p className='no-result'> no posts</p>
      )}
    </>
  );
}

