import { myData } from '@/lib/myData';
import { requestUser } from '@/lib/requestUser';

// GET /api/my-data: everything kwanqa keeps about the signed-in learner, as
// a JSON file to save. Only ever their own data, and never cached.
export async function GET(request: Request) {
  const user = await requestUser(request);
  if (!user) return Response.json({ error: 'Log in to download your data.' }, { status: 401 });

  const data = await myData(user);
  if (!data) return Response.json({ error: 'Downloads aren’t set up yet. Email kwanqa.team@gmail.com.' }, { status: 503 });

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="kwanqa-my-data.json"',
      'Cache-Control': 'private, no-store',
    },
  });
}
