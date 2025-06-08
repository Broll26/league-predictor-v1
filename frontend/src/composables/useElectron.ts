export function useElectron() {
  const ping = () => {
    window.electronAPI?.ping();
  };

  return { ping };
}
