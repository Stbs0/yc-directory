"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";

import { writeClient } from "@/sanity/lib/writeClient";
export const createPitch = async (
  state: unknown,
  formData: FormData,
  pitch: string,
) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      status: "ERROR",
      message: "You must be logged in to create a pitch.",
    });
  }
  const { name, description, category, link } = Object.fromEntries(
    Array.from(formData).filter(([key]) => key !== "pitch"),
  );
  const slug = slugify(name as string, {
    lower: true,
    strict: true,
  });

  try {
    const startup = {
      name,
      description,
      category,
      link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch
    };

    const result = await writeClient.create({ _type: "startup", ...startup });

    return parseServerActionResponse({ ...result, status: "SUCCESS" });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      status: "ERROR",
      message: "Something went wrong.",
    });
  }
};
