import { m, motion } from 'framer-motion'
import type { NextPage } from 'next'
import Key from '../components/calculator-key.component'
import { useTheme } from "next-themes";
import { useState } from 'react';
import { evaluate } from 'mathjs'
const Home: NextPage = () => {
  const { theme, setTheme } = useTheme();
  const [input, setInput] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [lastOperation, setLastOperation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [parenthesis, setParentehsis] = useState(false);
  const tokenize = (input: any) => {
    let tokens = [];
    for (let i = 0; i < input.length; i++) {
      if (/\d+/.test(input[i])) tokens.push({
        value: input[i],
        type: "number"
      })
      else if (/(\+|\-|\*|\/|\.|\,)/.test(input[i])) tokens.push({
        value: input[i],
        type: "dark"
      })
    }
    return tokens;
  }
  const Keys = [{
    text: "AC",
    type: "light",
    input: () => {
      setInput([])
      setError("")
      setLastOperation("")
    }
  }, {
    text: "+/-",
    type: "light"
  }, {
    text: "%",
    type: "light"
  },
  {
    text: "÷",
    type: "dark"
  },
  ...[7, 8, 9].map((n: number) => ({
    text: n + "",
    type: "normal"
  })),
  {
    text: "x",
    type: "dark"
  },
  ...[4, 5, 6].map((n: number) => ({
    text: n + "",
    type: "normal"
  })),
  {
    text: "-",
    type: "dark"
  },
  ...[1, 2, 3].map((n: number) => ({
    text: n + "",
    type: "normal"
  })),
  {
    text: "+",
    type: "dark"
  },
  {
    text: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
    </svg>
    ,
    type: "normal",
    input: () => setInput(input.slice(0, -1))
  },
  {
    text: "0",
    type: "normal"
  },
  {
    text: ".",
    type: "normal"
  },
  {
    text: "=",
    type: "dark",
    input: () => {
      try {
        const newInput = input.map(x => x.value)
          .join("")
          .replaceAll("÷", "/")
          .replaceAll("x", "*")
          .replace(/√\s*(\d+|\((?:\d+\s*[+\-\/*^]?)+\))/g, (_, sqrtInput) =>
            `sqrt(${sqrtInput[0] === '('
              ? sqrtInput.slice(1, -1)
              : sqrtInput
            })`
          );


        const results = evaluate(newInput)
        const tokens = tokenize(results.toLocaleString() + '');
        setLastOperation(input.map((x: any) => x.value).join(""))
        setInput(tokens)
        setError("")
      } catch (err) {
        setError((err as any).message)
      }
    }
  },
  ]
  return (
    <>
      <div className="calculator flex flex-col justify-between">
        <div className="calculator-top rounded-lg p-5 justify-center flex">
          <div className="theme-switcher p-2 w-2/6 rounded-xl flex justify-center gap-5 flex-row">
            <div className="theme" >
              <svg onClick={() => {
                setTheme("LIGHT")
              }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${(theme || "LIGHT") === "LIGHT" ? "normal" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>

            </div>
            <div className="theme">
              <svg onClick={() => {
                setTheme("DARK")
              }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${(theme || "DARK") === "DARK" ? "normal" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="calculator-middle p-5 w-screen h-screen flex justify-end items-end flex-col">
          {error && <h1 className="text-2xl break-all dark">{error}</h1>}
          {lastOperation && <h1 className={`text-md break-all gray ${input.length > 0 ? "" : "pb-10"}`}>{lastOperation}</h1>}
          <h1 className="text-5xl normal break-all">{input.map(x => {
            return x.type !== "normal" ? <span className={`${x.type}`}>{x.value}</span> : x.value
          })}</h1>
        </div>
        <motion.div onClick={() => setIsOpen(!isOpen)} className="z-10 items-center calculator-popout flex flex-col p-3 normal bg-[#9480fd] rounded-t-3xl relative top-[1.5rem]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 mb-5 ${isOpen && "rotate-180"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          {isOpen && (<div className="flex items-center gap-5">
            <div onClick={() => {
              if (parenthesis) {
                setInput([...input, {
                  value: ")",
                  type: "blue"
                }])
                setParentehsis(false)
              }
              else {
                setInput([...input, {
                  value: "(",
                  type: "blue"
                }])
                setParentehsis(true)
              }

            }} className="p-3 rounded-lg flex justify-center items-center">&#40;&#41;</div>
            <div onClick={() => {
              setInput([...input, {
                value: "√",
                type: "blue"
              },])

            }} className="p-3 rounded-lg flex justify-center items-center">
              √
            </div>
            <div onClick={() => {
              setInput([...input, {
                value: "^",
                type: "blue"
              }])
            }} className="p-3 rounded-lg flex justify-center items-center">
              x<sup>y</sup>
            </div>
            <div onClick={() => {
              setInput([...input, {
                value: "!",
                type: "blue"
              }])

            }} className="p-3 rounded-lg flex justify-center items-center">
              !
            </div>
          </div>)}
        </motion.div>
        <div className="z-20 calculator-bottom rounded-t-3xl p-5 grid grid-cols-4 gap-2">

          {Keys.map((key) => {
            return <Key onClick={(e: MouseEvent) => {
              e.preventDefault();
              if (key.input) return key.input();
              if (key.type === "normal") {
                setInput([...input, {
                  type: "number",
                  value: key.text
                }])
              } else if (key.type === "dark") {
                setInput([...input, {
                  type: "dark",
                  value: key.text
                }])
              } else if (key.text === "+/-") {
                const index = input.map((x: any) => x.type === "dark").lastIndexOf(true) + 1;
                if (input[index] && input[index].type === "light" && input[index].value === "-") {
                  const indexTwo = input.map((x: any) => x.type === "light" && x.value === "-").lastIndexOf(true);
                  input.splice(indexTwo, 1);
                  setInput([...input]);
                } else if (index !== input.length) input.splice(index, 0, {
                  type: "light",
                  value: "-"
                })
                setInput([...input])
              } else if (key.text === "%") {
                setInput([...input, {
                  type: "light",
                  value: key.text
                }])
              }
            }} text={key.text as string} type={key.type as ("light" | "dark" | "normal")} />
          })}
        </div>
      </div>
    </>
  )
}

export default Home
