import Button from "./Button";

const Topbar = () => {
    return (
      <header className="bg-white-600 text-black p-4">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <Button/>
      </header>
    );
  };
  
  export default Topbar; // ✅ Ensure this line is present
  