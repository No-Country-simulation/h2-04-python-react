import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ModeToggle";
function App() {
  return (
    <>
      <div className="container mx-auto px-2">
        <Button>Click me</Button>
        <ModeToggle />
      </div>
    </>
  );
}

export default App;
