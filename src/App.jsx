import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Launch from "./Launch";
import gif from "./assets/load.gif";

const url = "https://api.spacexdata.com/v4/launches/query";

function App() {
  const [page, setPage] = useState(1);
  const [launches, setLaunches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLastPage, setIsLastPage] = useState(false);
  const ref = useRef(null);
  const isInViewport = useIsInViewport(ref);

  const handleSuccess = (data) => {
    setIsLoading(false);
    setIsLastPage(!data.hasNextPage);
    if (data.hasNextPage) {
      setLaunches([...launches, ...data.docs]);
      setPage(data.nextPage);
    }
  };

  const handleError = (error) => {
    setError(error);
  };

  useEffect(() => {
    console.log(page);
    getLaunches(page, handleSuccess, handleError);
  }, [isInViewport]);

  return (
    <>
      <input type="text" placeholder="Enter keywords" className="search-bar" />
      <div className="app">
        {error && <p>Problem loading the page: {error}</p>}
        <ul>
          {!isLoading &&
            launches.map((launch) => {
              return <Launch key={launch.id} data={launch} />;
            })}
        </ul>
        <div ref={ref}></div>
        {isLoading && <img className="loading" src={gif} alt="loading" />}
        {isLastPage && <p className="end">END OF LIST</p>}
      </div>
    </>
  );
}

async function getLaunches(page, onSuccess, onError) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: [`options[page]=${page}`],
    });

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    const responseData = await response.json();
    onSuccess(responseData);
  } catch (error) {
    onError(true);
  }
}

function useIsInViewport(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}

export default App;
