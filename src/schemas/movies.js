import z from "zod";

const movieSchema = z.object({
  title: z.string(),
  year: z.number().int().positive().min(1900),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: "poster must be a valid URL",
  }),
  genre: z
    .enum([
      "Action",
      "Adventure",
      "Thriller",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Sci-Fi",
    ])
    .array(),
});

export const validateMovie = (object) => {
  return movieSchema.safeParse(object);
};

export const validatePartialMovie = (object) => {
  return movieSchema.partial().safeParse(object);
};
