export default function NotFound() {
    return (
        <div 
            style={{ 
                display: "grid",
                placeContent: "center",
                minHeight: '100dvh'
            }}
        >
            <img 
                src="/public/img/NotFound/not_found_page.svg"
                alt="page not found"
                className="mb-5"
                style={{ 
                    maxHeight: "90dvh",
                    maxWidth: "70vw"
                }}
            />
        </div>
    )
}