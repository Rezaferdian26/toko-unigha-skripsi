export default function Title({ children }) {
    return (
        <div className="text-left my-5">
            <h1 className="text-indigo-900 font-bold tracking-wide text-2xl mb-3 inline uppercase">
                {children}
            </h1>
            <span className="bg-indigo-900 w-20 h-0.5 align-middle mx-3 mb-2 hidden sm:inline-block"></span>
        </div>
    )
}