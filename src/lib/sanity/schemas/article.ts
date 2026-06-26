import { defineType, defineField } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (min)",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "isOpportunity",
      title: "Is Opportunity",
      type: "boolean",
      description: "Toggle this on if this article represents a scholarship, internship, fellowship, or job opportunity.",
      initialValue: false,
    }),
    defineField({
      name: "opportunityType",
      title: "Opportunity Type",
      type: "string",
      hidden: ({ document }) => !document?.isOpportunity,
      options: {
        list: [
          { title: "Scholarship", value: "scholarship" },
          { title: "Internship", value: "internship" },
          { title: "Fellowship", value: "fellowship" },
          { title: "Job Opportunity", value: "job" },
        ]
      }
    }),
    defineField({
      name: "educationLevel",
      title: "Education Level",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.isOpportunity,
      options: {
        list: [
          { title: "High School", value: "high-school" },
          { title: "Undergraduate", value: "undergraduate" },
          { title: "Postgraduate (Master's)", value: "postgraduate" },
          { title: "Ph.D. / Research", value: "phd" },
        ]
      }
    }),
    defineField({
      name: "fundingType",
      title: "Funding Type",
      type: "string",
      hidden: ({ document }) => !document?.isOpportunity,
      options: {
        list: [
          { title: "Fully Funded", value: "fully-funded" },
          { title: "Partially Funded", value: "partially-funded" },
          { title: "Paid", value: "paid" },
          { title: "Unpaid / Volunteer", value: "unpaid" },
        ]
      }
    }),
    defineField({
      name: "deadline",
      title: "Application Deadline",
      type: "date",
      hidden: ({ document }) => !document?.isOpportunity,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
