import { z } from "zod";

const defaultInstances = [
  {
    id: "preset-misskey-io",
    label: "misskey-io",
    name: "misskey.io",
    url: "https://misskey.io",
  },
  {
    id: "preset-sushi-ski",
    label: "sushi-ski",
    name: "sushi.ski",
    url: "https://sushi.ski",
  },
  {
    id: "preset-misskey-design",
    label: "misskey-design",
    name: "misskey.design",
    url: "https://misskey.design",
  },
] as const;

function isAllowedUrl(value: string) {
  try {
    const parsed = new URL(value);
    const isHttps = parsed.protocol === "https:";
    const isLocalhost =
      import.meta.env.DEV &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
      parsed.protocol === "http:";

    return isHttps || isLocalhost;
  } catch {
    return false;
  }
}

export const instanceDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "表示名を入力してください。")
    .max(80, "表示名は 80 文字以内で入力してください。"),
  url: z
    .string()
    .trim()
    .min(1, "URL を入力してください。")
    .refine(isAllowedUrl, "HTTPS の Misskey URL を入力してください。開発時のみ http://localhost を許可します。"),
});

export const instanceEntrySchema = instanceDraftSchema.extend({
  id: z.string().min(1),
  label: z.string().min(1),
});

export const appConfigSchema = z.object({
  instances: z.array(instanceEntrySchema),
});

export type InstanceDraft = z.infer<typeof instanceDraftSchema>;
export type InstanceEntry = z.infer<typeof instanceEntrySchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;

export const initialFormState: InstanceDraft = {
  name: "",
  url: "",
};

export const defaultConfig: AppConfig = {
  instances: [...defaultInstances],
};

export function normalizeInstanceDraft(draft: InstanceDraft) {
  return {
    name: draft.name.trim(),
    url: draft.url.trim().replace(/\/+$/, ""),
  };
}
