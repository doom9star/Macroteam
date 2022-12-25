import { CError } from "../graphql/generated";

export function normalizeErrors(errors: CError[]) {
  const result: { [k: string]: string } = {};
  errors.forEach((e) => (result[e.property] = e.message));
  return result;
}

export function getTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en", {
    timeStyle: "short",
  });
}

export function getDate(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
