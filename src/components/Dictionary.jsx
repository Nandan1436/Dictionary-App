// import '../App.css'
import {useState} from 'react'
const Dictionary = () => {
  const [word, setWord] = useState("")
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const fetchWord =async(query)=>{
    const searchWord = query || word
    if (!searchWord) return

    try{
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
      
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

  const fetchSuggestion = async(input)=>{
    if(!input){
      setSuggestions([])
      return
    }
    try{
      const res = await fetch(`https://api.datamuse.com/sug?s=${input}`)
      const result = await res.json()
      setSuggestions(result.slice(0,5).map(s=>s.word))
    }
    catch(error){
      console.error("Error fetching suggestions:", error);
    }
  }

  return (
    <div className="box">
        <h1>Dictionary App</h1>

        <div className='children'>
          <div className='input-container'>
            <input 
              type="text" 
              placeholder='Enter word'
              value={word}
              onChange={(e)=>{
                setWord(e.target.value)
                fetchSuggestion(e.target.value)
              }}
              onKeyDown={(e)=>{
                if(e.key==='Enter'){
                  fetchWord()
                  setSuggestions([])
                }
              }}
            />
            <button onClick={() => {
              fetchWord(word)
              setSuggestions([])
              }}>Enter</button>
          </div>
          
          
          
          {suggestions.length>0 && (
            <ul className='suggestions'>
              {suggestions.map((suggestion,index)=>(
                <li key={index} onClick={() => {
                  setWord(suggestion);
                  console.log(suggestion,word)
                  setSuggestions([]);
                  fetchWord(suggestion)
                }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          
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
                    Synonyms: {meaning?.definitions[0]?.synonyms.length > 0 ? meaning?.definitions[0]?.synonyms.join(", ") : "None"}
                  </p>
                  <p className='antonyms'>
                    Antonyms: {meaning?.definitions[0]?.antonyms.length > 0 ? meaning?.definitions[0]?.antonyms.join(", ") : "None"}
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
