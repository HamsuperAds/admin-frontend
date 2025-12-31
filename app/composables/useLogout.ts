export async function useLogout() {
  const { signOut } = useAuth();
  await navigateTo("/");
  try {
    await signOut();
  }
  catch (e) {
    void e;
  }
}
