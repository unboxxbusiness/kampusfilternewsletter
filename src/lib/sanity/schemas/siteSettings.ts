import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "homepageHeroTitle",
      title: "Homepage Hero Title",
      type: "string",
    }),
    defineField({
      name: "homepageHeroDescription",
      title: "Homepage Hero Description",
      type: "text",
    }),
    defineField({
      name: "defaultSeoTitle",
      title: "Default SEO Title",
      type: "string",
    }),
    defineField({
      name: "defaultSeoDescription",
      title: "Default SEO Description",
      type: "text",
    }),
    defineField({
      name: "socialShareImage",
      title: "Social Share Image",
      type: "image",
    }),
  ],
});
