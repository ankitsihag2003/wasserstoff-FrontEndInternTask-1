import React, { useState } from "react";

interface UsernamePromptProps {
  onJoin: (username: string) => void;
}

const UsernamePrompt: React.FC<UsernamePromptProps> = ({ onJoin }) => {
  const [name, setName] = useState<string>("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") {
      alert("Please enter a username");
      return;
    }
    onJoin(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-auto bg-[#1f1f1f]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-8 py-6">
        <form onSubmit={handleJoin} className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-white text-center">Enter Your Username</h2>

          <input
            type="text"
            placeholder="Username"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-inner"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold shadow-sm"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernamePrompt;
