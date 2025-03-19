// import '../App.css'
import {useState} from 'react'
const Dictionary = () => {
  const [word, setWord] = useState("")
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  const fetchWord =async()=>{
    if (!word) return

    try{
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      
      if(!res.ok){
        throw new Error(`Word not found!`)
      }
      const result = await res.json()
      setData(result[0])
      setError("")
    }
    catch(err){
      setError(err.message)
      setData(null)
    }



  }

  return (
    <div className="box">
        <h1>Dictionary App</h1>

        <div className='children'>
          <input 
            type="text" 
            placeholder='Enter word'
            value={word}
            onChange={(e)=>setWord(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==='Enter'){
                fetchWord()
              }
            }}
          />
          <button onClick={fetchWord}>Enter</button>

          
          {error && <p style={{ color: "red" }}>{error}</p>}

          {data && (
            <>
              <p className='word'>{data.word}</p>
              <p className='phonetics'>{data.phonetic || "N/A"}</p>

              {data.meanings.map((meaning,index)=>(
                <div key={index} className='meaning'>
                  <p className='pof'>{meaning.partOfSpeech || "N/A"}</p>
                  <p className='definition'>{meaning.definitions[0]?.definition || "N/A"}</p>
                  <p className='example'>{meaning?.definitions[0]?.example || "N/A"}</p>
                  <p className='synonyms'>
                    Synonyms: {meaning?.definitions[0]?.synonyms.length > 0 ? data.meanings[0]?.definitions[0]?.synonyms.join(", ") : "None"}
                  </p>
                  <p className='antonyms'>
                    Antonyms: {meaning?.definitions[0]?.antonyms.length > 0 ? data.meanings[0]?.definitions[0]?.antonyms.join(", ") : "None"}
                  </p>
                </div>
              ))}
              
            </>
          )}

          
      </div>
    </div>
  )
}

export default Dictionary
