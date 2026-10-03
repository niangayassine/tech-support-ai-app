import { useState } from 'react'

const API_URL = 'http://localhost:8000/api/chat'

export default function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setAnswer('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      })

      const data = await response.json()
      setAnswer(data.answer || 'Aucune réponse reçue.')
    } catch (error) {
      setAnswer('Erreur de connexion au backend. Vérifiez que le serveur est lancé sur le port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="panel">
        <h1>Tech Support AI</h1>
        <p className="subtitle">Assistant technique local et hors ligne</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Décrivez votre problème technique..."
            rows={5}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Analyse...' : 'Demander de l’aide'}
          </button>
        </form>

        <div className="answer-box">
          <h2>Réponse</h2>
          <pre>{answer || 'Votre réponse apparaîtra ici.'}</pre>
        </div>
      </div>
    </div>
  )
}
