
interface ActiveUsersProps {
    users: { username: string; color: string }[];
}
const ActiveUsers: React.FC<ActiveUsersProps> = ({ users }) => {
    return (
        <div className="w-70 bg-gray-800 text-gray-100 p-6 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>🟢</span>Active Users</h2>
            <ul className="space-y-4 overflow-y-auto max-h-[300px] pr-1">
                {users.map((u) => (
                    <li key={u.username} className="flex items-center gap-3 hover:bg-gray-800 px-2 py-1 rounded transition">
                        <div className="relative">
                            <span
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                                style={{ backgroundColor: u.color }}
                                title={`Color: ${u.color}`}
                            >
                                {u.username[0].toUpperCase()}
                            </span>
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-gray-900">  
                                <span className="absolute w-full h-full rounded-full animate-ping bg-green-400 opacity-75"></span> 
                            </span>
                        </div>
                        <span className="truncate">{u.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ActiveUsers