import InputAndDisplay from "@/components/inputForm/InputAndDisplay";
import Sidebar from "@/components/sidebar/sidebar";
import { Box } from "@mui/material";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const fetcher = (url, userText) => {
  let data = fetch(url, {
    method: "POST",
    body: JSON.stringify({ text: userText }),
  }).then((r) => r.json());
  console.log("Sending to backend", userText);
  return data;
};

export default function Home() {
  const [userText, setUserText] = useState();
  const [shouldFetch, setShouldFetch] = useState(false);
  const shouldFetchRef = useRef(shouldFetch);
  const [currentUser, setCurrentUser] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [showSave, setShowSave] = useState(true);
  const [mutateIt, setMutateIt] = useState(0);
  shouldFetchRef.current = shouldFetch;

  const { data, error, isLoading, isValidating } = useSWR(
    shouldFetchRef.current ? "/api/send-text" : null,
    (url) => fetcher(url, userText, setShouldFetch),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    setCurrentQuiz((prevState) => {
      if (data) {
        return data;
      }
      return prevState;
    });
  }, [data]);

  const handleTextAreaChange = (event) => {
    setShouldFetch(false);
    setCurrentQuiz(null);
    setUserText(event.target.value);
  };

  const sendDocument = () => {
    setShowSave(true);
    setShouldFetch(true);
  };

  return (
    <>
      <Head>
        <title>QuizMe.com</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://media.istockphoto.com/id/1005384502/vector/human-brain-icon-vector.jpg?s=612x612&w=0&k=20&c=iDiuZfC9HgPWSj-YM0HxaCSTgg3wg0fBDcpQj3qrShs="
        />
      </Head>
      <main>
        <Sidebar
          userID={currentUser}
          setCurrentQuiz={setCurrentQuiz}
          setShowSave={setShowSave}
          currentQuiz={currentQuiz}
          mutateIt={mutateIt}
        />
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            minHeight: "100vh",
            marginLeft: "15dvw",
            paddingTop: "6em",
          }}
        >
          <InputAndDisplay
            userID={currentUser}
            showSave={showSave}
            error={error}
            handleTextAreaChange={handleTextAreaChange}
            sendDocument={sendDocument}
            isLoading={isLoading}
            data={currentQuiz}
            isValidating={isValidating}
            currentQuiz={currentQuiz}
            setMutateIt={setMutateIt}
          />
        </Box>
      </main>
    </>
  );
}
