import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation()

    const isLoginPageOrRegisterPage = location.pathname === '/login' || location.pathname === '/register'

    if (isLoginPageOrRegisterPage) {
        return <Outlet />;
    }

    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout