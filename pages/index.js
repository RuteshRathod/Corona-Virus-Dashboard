import Head from "next/head";
import dynamic from "next/dynamic";
import fetch from "node-fetch";
import { useCountUp } from "react-countup";

const TimeseriesGraphClient = dynamic(import("../src/components/TimeseriesGraph"));

import css from "../src/styles/index.module.scss";

const Home = ({ global, countries }) => {
  const [country, setCountry] = React.useState("India");
  const [countryData, setCountryData] = React.useState({
    isLoading: true,
    data: {
      confirmed: null,
      deaths: null,
      recovered: null
    }
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register("/service-worker.js", { scope: "/" })
          .then(function (registration) {
            console.log("SW registered: ", registration);
          })
          .catch(function (registrationError) {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }, []);

  React.useEffect(() => {
    fetch(`https://covid19.mathdro.id/api/countries/${country}`)
      .then(response => response.json())
      .then(data => {
        try {
          const { confirmed, deaths, recovered } = data;

          setCountryData({
            isLoading: false,
            data: {
              confirmed: confirmed.value,
              deaths: deaths.value,
              recovered: recovered.value
            }
          });
        } catch {
          setError(`Sorry, can't find data for ${country}`);
        }
      });
  }, [country]);

  const getCountryData = event => {
    setCountryData({ ...countryData, isLoading: true });
    setCountry(event.target.value);
    setError("");
  };

  const { countUp: confirmedCount } = useCountUp({
    end: global.confirmed,
    duration: 1
  });
  const { countUp: deathCount } = useCountUp({
    end: global.deaths,
    duration: 1
  });
  const { countUp: recoveredCount } = useCountUp({
    end: global.recovered,
    duration: 1
  });

  return (
    <div className={css.container}>

      <span><h4>Visitor's Count :-</h4>
        <a href="https://www.freecounterstat.com" title="website counter"><img src="https://counter7.stat.ovh/private/freecounterstat.php?c=btawxp2dysmbl5uqd1msr7f1hgpj255a" border="0" title="website counter" alt="website counter"/></a></span>
      <Head>
        <script data-ad-client="ca-pub-4445778372781917" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <title>Coronavirus Disease (COVID-19)</title>
        <link rel="icon" href="/favicon1.ico" />
        <meta name="theme-color" content="#222222" />
        <meta name="description" content="COVID-19 dashboard with stats about global and each country outbreak" />
        <meta name="application-name" content="COVID-19" />
        <link rel="icon" type="image/png" sizes="60x60" href="/favicon1p.png" />
        <link rel="icon" href="/favicon1.ico" type="image/x-icon" />
      </Head>

      <main>
        <h1 className={css.title}>Coronavirus Disease (COVID-19) Dashboard </h1>

        <h2 className={css.subtitle}>Global Patient Count</h2>
        <section className={css.cardContainer}>
          <div className={css.card} style={{ color: "#ffc107" }}>
            <h2 className={css.cardHeader}>Confirmed</h2>
            <h2 className={css.countNumber}>{Number(confirmedCount).toLocaleString()}</h2>
          </div>
          <div className={css.card} style={{ color: "#dc3545" }}>
            <h2 className={css.cardHeader}>Deaths</h2>
            <h2 className={css.countNumber}>{Number(deathCount).toLocaleString()}</h2>
          </div>
          <div className={css.card} style={{ color: "#82ca9d" }}>
            <h2 className={css.cardHeader}>Recovered</h2>
            <h2 className={css.countNumber}>{Number(recoveredCount).toLocaleString()}</h2>
          </div>
        </section>

        <h2 className={css.subtitle} style={{ marginTop: "2rem" }}>
          Select Country
        </h2>
        <select className={css.input} placeholder="select country" onChange={getCountryData} value={country}>
          {countries.map(country => (
            <option key={country.name} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        {countryData.isLoading && !error ? (
          <div className={css.loadingSection}>
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
            <section className={`${css.cardContainer} ${css.countryCardContainer}`} style={{ marginTop: "1rem" }}>
              <div className={css.card} style={{ color: "#ffc107" }}>
                <h2 className={css.cardHeader}>Confirmed</h2>
                <h2 className={css.countNumber}>{Number(countryData.data.confirmed).toLocaleString()}</h2>
              </div>
              <div className={css.card} style={{ color: "#dc3545" }}>
                <h2 className={css.cardHeader}>Deaths</h2>
                <h2 className={css.countNumber}>{Number(countryData.data.deaths).toLocaleString()}</h2>
              </div>
              <div className={css.card} style={{ color: "#82ca9d" }}>
                <h2 className={css.cardHeader}>Recovered</h2>
                <h2 className={css.countNumber}>{Number(countryData.data.recovered).toLocaleString()}</h2>
              </div>
            </section>
          )}

        {error && (
          <div className={css.loadingSection}>
            <h3>{error}</h3>
          </div>
        )}

        <h2 className={css.subtitle} style={{ marginTop: "2rem" }}>
          Global Outbreak Graph
        </h2>
        <section
          className={css.card}
          style={{
            padding: 0,
            width: "100%",
            height: "400px"
          }}>
          <TimeseriesGraphClient />
        </section>
      </main>


      <footer className={css.footer}>
        Courtesy:{" "}
        <a
          className={css.link}
          href="https://github.com/CSSEGISandData/COVID-19"
        >
          Data Repository by Johns Hopkins CSSE
        </a>{" "}
       &{" "}
        <a
          className={css.link}
          href="https://github.com/mathdroid/covid-19-api"
        >
          COVID-19 API
        </a>
         &{""} Jibin Thomas {""}{""}

          Devloped By{" "}
          <a
            className={css.link}
          href="https://www.linkedin.com/in/ruteshrathod/"
          >
          Rutesh Rathod
        </a>
      </footer>

    </div>
  );
};

export async function getStaticProps () {
  const global = await fetch("https://covid-dashboard.now.sh/api/global");
  const globalData = await global.json();

  const countries = await fetch("https://covid19.mathdro.id/api/countries");
  const countriesData = await countries.json();

  return { props: { global: globalData, countries: countriesData.countries } };
}

export default Home;