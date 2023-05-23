import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import ReactLoading from "react-loading";

// Components
import FavPoke from "./components/FavPoke";

function App() {
  const [poke, setPoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [number, setNumber] = useState(1);
  const [fav, setFav] = useState([]);

  useEffect(() => {
    let abortController = new AbortController(); // AbortControlle (cancle request) ป้องกันการเรียกซ้ำ

    const loadPoke = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${number}`,
          {
            signal: abortController.signal, // ส่ง signal ให้กับ request ที่เรายิงไป
          }
        );

        setPoke(response.data);
        setError("");
      } catch (err) {
        setError("Something went wrong", err);
      } finally {
        setLoading(false);
      }
    };

    loadPoke();

    return () => abortController.abort(); // return เพื่อเคลียร์ cancle request
  }, [number]); // [] emtry array dependentcy ใช้เพื่อ run ครั้งเดียว
  // useEffect ถ้า number เปลี่ยนจะทำรันโค้ดข้างในใหม่

  const prevPoke = () => {
    setNumber((number) => number - 1);
  };
  const nextPoke = () => {
    setNumber((number) => number + 1);
  };

  const addFav = () => {
    setFav((oldState) => [...oldState, poke]); // ใช้ array ในการ update state -> ส่ง oldstate มา พร้อมกับ state ตัวใหม่
  }; // ถ้าไม่มี oldstate ใน array จะส่งมาแค่ตัวใหม่แล้วจะเก็บตัวใหม่ทับตัวเก่า ใน array จะเหลือแค่ตัวเดียว

  console.log("Pokemon ID: ", number);
  console.log("Your fac pokemon: ", fav);
  // console.log(poke);

  // optional chaining (?.) เพื่อเช็ค
  // ใช้ .map เพราะ abilities เป็น array

  return (
    <div className="max-w-5xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="grid sm:grid-col-1 md:grid-cols-2 lg:grid-cols-2">
        {" "}
        {/* ขนาดจอเล็กมี 1 col จอกลาง 2 col จอใหญ่ 2 col */}
        <div>
          {loading ? (
            <ReactLoading
              type="spin"
              color="black"
              height={"20%"}
              width={"20%"}
            />
          ) : (
            <>
              <h1>{poke?.name}</h1>
              <button onClick={addFav}>Add to favourite</button>
              <img
                src={poke?.sprites?.other?.home?.front_default}
                alt={poke?.name}
              />
              <ul>
                {poke?.abilities?.map((abil, idx) => (
                  <li key={idx}>{abil?.ability?.name}</li>
                ))}
              </ul>
              <button onClick={prevPoke}>Previous</button>
              <button onClick={nextPoke}>Next</button>
            </>
          )}
        </div>
        <div>
          <h2>Your favourite pokemon</h2>
          {/* ถ้ายังไม่มี favourite จะให้ show No favourite pokemon... โดยการเช็คจาก length ของ array*/}
          {fav.length > 0 ? (
            <FavPoke fav={fav} />
          ) : (
            <div className="flex h-full justify-center items-center">
              {" "}
              <p>No favourite pokemon...</p>
            </div>
          )}
          {/* fav คือ props เป็นการส่ง usestate ที่ชื่อว่า fav ไปยัง components FavPoke  */}
        </div>
      </div>
    </div>
  );
}

export default App;
