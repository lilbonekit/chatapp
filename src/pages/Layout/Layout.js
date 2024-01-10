import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation()

    const isLoginPageOrRegisterPage = location.pathname === '/login' || location.pathname === '/register'

    if (isLoginPageOrRegisterPage) {
        return <Outlet />;
    }

    return (
        <div>
            <header>Заголовок сайта</header>
            <main>
                <Outlet />
            </main>
            <footer>Подвал сайта</footer>
        </div>
    )
}

export default Layout