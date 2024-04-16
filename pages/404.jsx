import Link from "next/link";
import Head from "next/head";
import style from "../components/style/404.module.css";

export default function Custom404() {
	return (
		<div>
			<Head>
				<title>404</title>
			</Head>
			<div className={`${style.wrapper} `}>
				<h1>404</h1>
				<h2>PAGE NOT FOUND</h2>
				<p className="mt-4 mb-5">
					The page you are looking for might have been removed had its name
					changed or is temporarily unavailable.
				</p>
				<Link href="/">
					<a>HOMEPAGE</a>
				</Link>
			</div>
		</div>
	);
}
