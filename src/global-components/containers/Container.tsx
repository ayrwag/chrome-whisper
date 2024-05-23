const Container = ({children}:{children:React.ReactNode}) => {
    return (
        <div className="flex flex-col items-center h-full justify-center">
            {children}
        </div>
    );
}

export default Container;