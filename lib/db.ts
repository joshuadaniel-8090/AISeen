import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default sql;

export type User = {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: "free" | "indie" | "pro";
  alerts_enabled: boolean;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  brand_name: string;
  domain: string | null;
  category: string;
  active: boolean;
  created_at: string;
};

export type Prompt = {
  id: string;
  project_id: string;
  text: string;
  active: boolean;
};

export type Check = {
  id: string;
  prompt_id: string;
  engine_id: string;
  run_at: string;
  mentioned: boolean;
  cited: boolean;
  position: number | null;
  sentiment: string | null;
  raw_response: string | null;
};

export type Alert = {
  id: string;
  project_id: string;
  type: string;
  message: string;
  sent_at: string;
  read: boolean;
};

export type Competitor = {
  id: string;
  project_id: string;
  name: string;
  domain: string | null;
};

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return (rows[0] as User) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return (rows[0] as User) ?? null;
}

export async function createUser(email: string): Promise<User> {
  const rows =
    await sql`INSERT INTO users (email) VALUES (${email}) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING *`;
  return rows[0] as User;
}

export async function updateUserPlan(
  userId: string,
  plan: string,
  stripeCustomerId?: string
): Promise<void> {
  if (stripeCustomerId) {
    await sql`UPDATE users SET plan = ${plan}, stripe_customer_id = ${stripeCustomerId} WHERE id = ${userId}`;
  } else {
    await sql`UPDATE users SET plan = ${plan} WHERE id = ${userId}`;
  }
}

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  return (await sql`SELECT * FROM projects WHERE user_id = ${userId} AND active = TRUE ORDER BY created_at DESC`) as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const rows = await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
  return (rows[0] as Project) ?? null;
}

export async function createProject(
  userId: string,
  brandName: string,
  domain: string | null,
  category: string
): Promise<Project> {
  const rows =
    await sql`INSERT INTO projects (user_id, brand_name, domain, category) VALUES (${userId}, ${brandName}, ${domain}, ${category}) RETURNING *`;
  return rows[0] as Project;
}

export async function getPromptsByProject(
  projectId: string
): Promise<Prompt[]> {
  return (await sql`SELECT * FROM prompts WHERE project_id = ${projectId} AND active = TRUE`) as Prompt[];
}

export async function createPrompt(
  projectId: string,
  text: string
): Promise<Prompt> {
  const rows =
    await sql`INSERT INTO prompts (project_id, text) VALUES (${projectId}, ${text}) RETURNING *`;
  return rows[0] as Prompt;
}

export async function getCompetitorsByProject(
  projectId: string
): Promise<Competitor[]> {
  return (await sql`SELECT * FROM competitors WHERE project_id = ${projectId}`) as Competitor[];
}

export async function getRecentAlerts(
  projectId: string,
  limit = 10
): Promise<Alert[]> {
  return (await sql`SELECT * FROM alerts WHERE project_id = ${projectId} ORDER BY sent_at DESC LIMIT ${limit}`) as Alert[];
}

export async function getChecksForProject(
  projectId: string,
  historyDays: number
): Promise<
  (Check & { prompt_text: string; engine_name: string; engine_slug: string })[]
> {
  return (await sql`
    SELECT c.*, p.text as prompt_text, e.name as engine_name, e.slug as engine_slug
    FROM checks c
    JOIN prompts p ON p.id = c.prompt_id
    JOIN engines e ON e.id = c.engine_id
    WHERE p.project_id = ${projectId}
      AND c.run_at > NOW() - INTERVAL '1 day' * ${historyDays}
    ORDER BY c.run_at DESC
  `) as (Check & {
    prompt_text: string;
    engine_name: string;
    engine_slug: string;
  })[];
}
