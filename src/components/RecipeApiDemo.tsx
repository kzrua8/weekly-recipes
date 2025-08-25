import { useMemo, useState } from "react";

/**
 * Simple React demo to call the Weekly Recipes API.
 *  - Switch between Node (3000) and Spring (8080) backends
 *  - Call sample endpoints with buttons
 *  - See JSON responses inline
 *
 * ENV support:
 *  - VITE_API_BASE_URL (e.g., http://localhost:3000 or http://localhost:8080)
 *    If set, it will be used as the default. Otherwise, choose from the dropdown.
 */

// Utility: pretty-print JSON
function PrettyJson({ data }: { data: unknown }) {
  return (
    <pre className="whitespace-pre-wrap rounded-xl bg-gray-100 p-4 text-sm">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function RecipeApiDemo() {
  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

  const [backend, setBackend] = useState(envBase ?? "http://localhost:3000");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoints = useMemo(
    () => ({
      listRecipes: `${backend}/api/recipes`,
      createRecipe: `${backend}/api/recipes`,
      weeklyPlan: (date: string) => `${backend}/api/weeks/${date}/plan`,
    }),
    [backend]
  );

  async function callApi<T>(url: string, init?: RequestInit) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(url, init);
      // helpful text when non-2xx
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const json = (await res.json()) as T;
      setResult(json);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Weekly Recipes – API Demo</h1>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Backend base URL</span>
          <select
            className="rounded-xl border p-2"
            value={backend}
            onChange={(e) => setBackend(e.target.value)}
          >
            {envBase && <option value={envBase}>ENV: {envBase}</option>}
            <option value="http://localhost:3000">
              Node (http://localhost:3000)
            </option>
            <option value="http://localhost:8080">
              Spring (http://localhost:8080)
            </option>
            <option value="custom">Custom… (type below)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Custom base URL</span>
          <input
            className="rounded-xl border p-2"
            placeholder="http://localhost:3000"
            onChange={(e) => setBackend(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <button
          className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
          onClick={() => callApi(endpoints.listRecipes)}
        >
          GET /api/recipes
        </button>

        <button
          className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          disabled={isLoading}
          onClick={() =>
            callApi(endpoints.createRecipe, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "Miso Soup",
                steps: "Boil dashi, add miso.",
                ingredients: [{ name: "miso", quantity: 30, unit: "GRAM" }],
              }),
            })
          }
        >
          POST /api/recipes
        </button>

        <button
          className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          disabled={isLoading}
          onClick={() => callApi(endpoints.weeklyPlan("2025-08-25"))}
        >
          GET /api/weeks/2025-08-25/plan
        </button>
      </div>

      {isLoading && <div className="text-sm text-gray-600">Loading…</div>}
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {result ? <PrettyJson data={result} /> : null}

      <hr className="my-6" />
      <div className="space-y-2 text-sm text-gray-700">
        <p className="font-semibold">Notes</p>
        <ul className="list-disc pl-5">
          <li>
            If you see a CORS error from the browser, enable CORS in your
            backend. For Spring, add a<code> CorsConfigurationSource </code>{" "}
            bean (or <code>@CrossOrigin</code>). For Node/Express,
            <code> npm i cors </code> and <code>app.use(cors())</code>.
          </li>
          <li>
            If you enabled Spring Security later, protected endpoints will
            return 401/403. In that case, add an
            <code>Authorization</code> header (e.g., Basic or Bearer) to your
            fetch calls.
          </li>
          <li>
            You can set <code>VITE_API_BASE_URL</code> in a <code>.env</code>{" "}
            file at the project root to default the base URL.
          </li>
        </ul>
      </div>
    </div>
  );
}
