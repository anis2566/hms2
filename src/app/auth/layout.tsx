interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return <div className="w-full flex items-center justify-center h-screen px-3">{children}</div>;
};

export default AuthLayout;