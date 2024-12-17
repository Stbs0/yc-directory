import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdown from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupCardType } from "@/components/StartupCard";

export const experimental_ppr = true;
export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const md = markdown();

  const id = (await params).id;
  console.log(id);
  const [post, { select }] = await Promise.all([
    await client.fetch(STARTUP_BY_ID_QUERY, { id }),
    await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "eeeeeeeeeeeeee-edgvrg",
    }),
  ]);

  if (!post) {
    return notFound();
  }

  const parseContent = md.render(post?.pitch || "");

  return (
    <>
      <section className='pink_container !min-h-[230px]'>
        <p className='tag'>{formatDate(post._createdAt)}</p>
        <h1 className='heading'>{post.name}</h1>
        <p className='sub-heading !max-q-5xl'>{post.description}</p>
      </section>
      <section className='section_container'>
        <img
          src={post.image || ""}
          alt='thim'
          width={1000}
          className='w-full h-auto rounded-xl'
        />
        <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
          <div className='flex-between gap-5'>
            <Link
              href={`/user/${post.author?._id}`}
              className='flex gap-2 items-center mb-3'>
              <Image
                src={post.author?.image || ""}
                alt='thim'
                width={40}
                height={40}
                className='rounded-full'
              />
              <div>
                <p className='text-20-medium'>{post.author?.name}</p>
                <p className='text-16-medium !text-black-300'>
                  @{post.author?.username}
                </p>
              </div>
            </Link>
            <p className='category-tag'>{post.category}</p>
          </div>
          <h3 className='text-30-bold'>pitch detailes</h3>
          {parseContent ? (
            <article
              className='prose max-w-4xl font-work-sans break-all'
              dangerouslySetInnerHTML={{ __html: parseContent }}
            />
          ) : (
            <p className='no-results'> no detiels provided</p>
          )}
        </div>
        <hr className='divider' />
        {select?.length > 0 && (
          <div className='max-w-4xl mx-auto'>
            <p className='text-30-semibold'>editor picks</p>
            <ul className='mt-7 card-sm'>
              {select.map((post: StartupCardType, index: number) => (
                <StartupCard
                  key={index}
                  post={post}
                />
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<Skeleton className='view_skeleton' />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}
