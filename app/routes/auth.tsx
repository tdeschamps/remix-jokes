import { Auth } from "@supabase/ui";
import { useSubmit, redirect } from "remix";
import type { ActionFunction } from "remix";
import React, { useEffect } from "react";
import { useSupabase } from "~/utils/supabase-client";
import { commitSession, getSession } from "~/utils/supabase.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const session = await getSession(request.headers.get("Cookie"));

  session.set("access_token", formData.get("access_token"));

  return redirect("/jokes", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function AuthBasic() {
  const supabase = useSupabase();

  const Container: React.FC = ({ children }) => {
    const { user, session } = Auth.useUser();
    const submit = useSubmit();

    useEffect(() => {
      if (user) {
        const formData = new FormData();

        const accessToken = session?.access_token;

        // you can choose whatever conditions you want
        // as long as it checks if the user is signed in
        if (accessToken) {
          formData.append("access_token", accessToken);
          submit(formData, { method: "post", action: "/auth" });
        }
      }
    }, [user]);

    return <>{children}</>;
  };

  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container> {/* TODO */}
        <Auth supabaseClient={supabase} />
      </Container>
    </Auth.UserContextProvider>
  );
}
