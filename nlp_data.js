// NLP Companion - Concepts Database
// CampusX NLP Course - Lectures 1-7
// Screenshots prefix matches lecture index (1=Lecture1, 2=Lecture2, etc.)

const NLP_DB = [

  // ─────────────────────────────────────────────
  // LECTURE 1 — Introduction to NLP
  // ─────────────────────────────────────────────
  {
    id: "nlp-intro",
    name: "Introduction to NLP",
    lectureNum: 1,
    category: "foundations",
    categoryName: "Foundations",
    videoId: "zlUpTlaxAKI",
    subtopics: ["What is NLP", "NLP Applications", "Challenges in NLP", "History"],
    intuition: `Natural Language Processing (NLP) is the field of AI that gives computers the ability to understand, interpret, generate, and reason about human language.

Unlike structured data (tables/numbers), text is:
  • Ambiguous: "I saw her duck" — verb or noun?
  • Context-dependent: "bank" can mean river bank or financial bank
  • Hierarchical: characters → words → sentences → paragraphs → documents

Key NLP Capabilities:
  Classification  → Is this email spam?
  Generation      → Write a summary of this article
  Translation     → English → Hindi
  Extraction      → Find all dates/names in a document
  Q&A             → Answer questions from a passage

Why NLP is Hard:
  • Polysemy (one word, many meanings)
  • Syntax vs Semantics (grammatically correct but nonsensical)
  • Sarcasm and figurative language
  • Morphological variations (go, goes, going, went)`,
    advantages: [
      "Enables machines to communicate in natural human language",
      "Powers massive real-world applications: search engines, assistants, translation",
      "Works on unstructured text data (80% of all data in the world)"
    ],
    disadvantages: [
      "Language is highly ambiguous and context-dependent — hard to formalize",
      "Models trained on English often fail for other languages",
      "Resource-intensive for low-resource languages"
    ],
    bestPractices: [
      "Always define the NLP task clearly before choosing a technique (classification vs generation vs extraction)",
      "Pre-process text consistently — same pipeline for train and test",
      "Know your domain: medical NLP needs different tokenizers than social media NLP"
    ],
    code: `# Quick NLP ecosystem overview
import nltk
import spacy
from sklearn.feature_extraction.text import CountVectorizer

# NLTK - great for linguistic processing
nltk.download('punkt')
from nltk.tokenize import word_tokenize
tokens = word_tokenize("Natural Language Processing is fascinating!")
print(tokens)

# spaCy - industrial-strength NLP
nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple is looking at buying U.K. startup for $1 billion")
for ent in doc.ents:
    print(ent.text, ent.label_)`
  },

  // ─────────────────────────────────────────────
  // LECTURE 2 — End-to-End NLP Pipeline
  // ─────────────────────────────────────────────
  {
    id: "nlp-pipeline",
    name: "End-to-End NLP Pipeline",
    lectureNum: 2,
    category: "foundations",
    categoryName: "Foundations",
    videoId: "29qyNyNkLHs",
    subtopics: ["Data Acquisition", "Text Cleaning", "Feature Engineering", "Model Building", "Deployment"],
    intuition: `An NLP pipeline is a sequence of steps that transforms raw text into a trained model and deployed solution.

Step-by-Step Pipeline:
  1. Data Acquisition
     → Web scraping, APIs, datasets (Kaggle, HuggingFace)
     → Label collection (crowdsourcing, weak supervision)

  2. Text Preprocessing
     → Lowercasing, punctuation removal
     → Stopword removal, stemming/lemmatization

  3. Feature Engineering / Text Representation
     → Bag of Words, TF-IDF, Word2Vec, BERT embeddings
     → Convert text to numeric vectors for models

  4. Model Building
     → Classical: Naive Bayes, Logistic Regression, SVM
     → Deep: LSTMs, Transformers (BERT, GPT)
     → Train → Evaluate → Tune

  5. Deployment
     → Flask/FastAPI REST endpoint
     → Containerize with Docker
     → Serve on Heroku / AWS / GCP

Each step feeds into the next. Poor preprocessing = poor model, even with the best algorithm.`,
    advantages: [
      "Systematic approach ensures no step is missed",
      "Modular design allows swapping components (e.g., change BoW → TF-IDF)",
      "Makes debugging and experiment tracking manageable"
    ],
    disadvantages: [
      "Preprocessing choices cascade — a bad choice early corrupts downstream steps",
      "Feature engineering is domain-specific; generic pipelines may underperform",
      "End-to-end deep learning models (BERT) can replace many steps but need more data"
    ],
    bestPractices: [
      "Build a minimal working pipeline first, then iteratively improve each stage",
      "Use the same preprocessing code for training and inference to prevent train-serve skew",
      "Track all experiments (MLflow, W&B) — text preprocessing decisions are easy to forget"
    ],
    code: `from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Sample data
texts = ["This movie is great!", "Terrible film, waste of time", "Loved it!", "Hated it"]
labels = [1, 0, 1, 0]

X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.25)

# Full pipeline: vectorization → model
pipe = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression())
])
pipe.fit(X_train, y_train)
print(classification_report(y_test, pipe.predict(X_test)))`
  },

  // ─────────────────────────────────────────────
  // LECTURE 3 — Text Preprocessing
  // ─────────────────────────────────────────────
  {
    id: "lowercasing",
    name: "Lowercasing & Basic Cleaning",
    lectureNum: 3,
    category: "preprocessing",
    categoryName: "Text Preprocessing",
    videoId: "6C0sLtw5ctc",
    subtopics: ["Lowercasing", "HTML tag removal", "Punctuation removal", "Number handling", "URL removal"],
    intuition: `The first pass of text cleaning eliminates noise before any linguistic processing.

Common cleaning steps:
  Lowercasing:       "Apple" → "apple"  (reduces vocabulary size)
  HTML removal:      "<b>text</b>" → "text"
  URL removal:       "visit http://xyz.com today" → "visit today"
  Punctuation:       "hello, world!" → "hello world"
  Number handling:   "the 5 cats" → "the cats" or "the NUM cats"
  Whitespace:        "  hello   " → "hello"

Why it matters:
  Without lowercasing: "Apple", "apple", "APPLE" = 3 different tokens
  With lowercasing: all become "apple" = 1 token
  This reduces vocabulary sparsity significantly.

Regex is the standard tool for most cleaning tasks.`,
    advantages: [
      "Drastically reduces vocabulary size (fewer unique tokens)",
      "Simple, fast, and always beneficial",
      "Prevents models from treating same-word variations as different features"
    ],
    disadvantages: [
      "Lowercasing loses capitalization signals (proper nouns: 'Apple' company vs apple fruit)",
      "Aggressive punctuation removal breaks contractions (\"don't\" → \"dont\" vs \"do\" \"not\")",
      "Numbers may carry meaning (ages, quantities) — removal should be task-specific"
    ],
    bestPractices: [
      "Apply cleaning consistently to both train and test/inference data",
      "For named entity recognition (NER), preserve capitalization — it is a strong signal",
      "Use re.compile() for speed when cleaning large corpora"
    ],
    code: `import re

def clean_text(text):
    text = text.lower()                          # lowercase
    text = re.sub(r'<[^>]+>', '', text)          # remove HTML tags
    text = re.sub(r'https?://\\S+', '', text)   # remove URLs
    text = re.sub(r'[^a-z\\s]', '', text)       # remove non-alpha chars
    text = re.sub(r'\\s+', ' ', text).strip()   # normalize whitespace
    return text

sample = "<b>Visit https://example.com for 50% Off!</b>"
print(clean_text(sample))
# Output: "visit for off"`
  },

  {
    id: "tokenization",
    name: "Tokenization",
    lectureNum: 3,
    category: "preprocessing",
    categoryName: "Text Preprocessing",
    videoId: "6C0sLtw5ctc",
    subtopics: ["Word Tokenization", "Sentence Tokenization", "Subword Tokenization", "NLTK", "spaCy"],
    intuition: `Tokenization splits text into meaningful units (tokens). It is the fundamental first step of almost every NLP task.

Types of Tokenization:
  Word tokenization:
    "I love NLP" → ["I", "love", "NLP"]

  Sentence tokenization:
    "I love NLP. It is fun." → ["I love NLP.", "It is fun."]

  Subword tokenization (used in BERT, GPT):
    "unhappiness" → ["un", "##happy", "##ness"]
    This handles unknown/rare words without a huge vocabulary.

  Character tokenization:
    "cat" → ["c", "a", "t"]
    Used for very noisy text or low-resource languages.

NLTK word_tokenize handles contractions:
  "don't" → ["do", "n't"]   ← smart split`,
    advantages: [
      "Creates the atomic units for all downstream processing",
      "NLTK/spaCy tokenizers handle edge cases (contractions, hyphens) gracefully",
      "Subword tokenization elegantly handles OOV (Out-of-Vocabulary) words"
    ],
    disadvantages: [
      "Simple whitespace splitting fails for languages without spaces (Chinese, Japanese)",
      "Word tokenization creates large, sparse vocabularies",
      "Language-specific tokenizers are needed for Hindi, Arabic, etc."
    ],
    bestPractices: [
      "Use spaCy tokenizer for production — it is faster and smarter than NLTK",
      "For transformer models (BERT), use their native tokenizer (AutoTokenizer) to match how they were pre-trained",
      "Sentence tokenization is crucial for tasks like summarization and machine translation"
    ],
    code: `import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize, sent_tokenize

text = "Don't stop believing. NLP is great, isn't it?"

# Word tokens
print(word_tokenize(text))
# ["Do", "n't", "stop", "believing", ".", "NLP", "is", "great", ",", "is", "n't", "it", "?"]

# Sentence tokens
print(sent_tokenize(text))
# ["Don't stop believing.", "NLP is great, isn't it?"]

# spaCy (recommended for production)
import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp(text)
word_tokens = [token.text for token in doc]
print(word_tokens)`
  },

  {
    id: "stopwords",
    name: "Stopword Removal",
    lectureNum: 3,
    category: "preprocessing",
    categoryName: "Text Preprocessing",
    videoId: "6C0sLtw5ctc",
    subtopics: ["Stop words", "NLTK stopwords", "Custom stopword lists", "Frequency filtering"],
    intuition: `Stopwords are common words that carry very little semantic meaning in isolation: "the", "is", "at", "which", "on", etc.

Removing them:
  • Reduces noise in the feature space
  • Reduces vocabulary size
  • Speeds up computation

Example:
  Raw: "The cat sat on the mat"
  After stopword removal: "cat sat mat"

The meaning is preserved for classification/clustering tasks.

⚠️ However, stopwords can matter:
  • Sentiment: "not good" → removing "not" gives "good" (wrong!)
  • Q&A / IR: "to be or not to be" — ALL are stopwords
  • Named Entity Recognition: "The Who" (band name) should not be split`,
    advantages: [
      "Reduces vocabulary and feature dimensionality significantly",
      "Speeds up vectorization and model training",
      "Removes high-frequency noise that can overwhelm TF-IDF signals"
    ],
    disadvantages: [
      "Removing negations ('not', 'no') can flip sentiment meaning",
      "Domain-specific stopwords vary — generic lists may remove important terms",
      "Does not help in transformer models where stopwords add positional context"
    ],
    bestPractices: [
      "Always check if negation words are in the stopword list and remove them for sentiment tasks",
      "Build a custom domain stopword list (e.g., in medical NLP, 'patient' may be a stopword)",
      "Skip stopword removal for transformer-based models — they handle context natively"
    ],
    code: `import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')

stop_words = set(stopwords.words('english'))

# Custom removal: keep negations for sentiment
stop_words -= {'no', 'not', "n't", 'nor'}

def remove_stopwords(tokens):
    return [word for word in tokens if word not in stop_words]

tokens = ["the", "movie", "was", "not", "good", "at", "all"]
print(remove_stopwords(tokens))
# ['movie', 'not', 'good']`
  },

  {
    id: "stemming",
    name: "Stemming",
    lectureNum: 3,
    category: "preprocessing",
    categoryName: "Text Preprocessing",
    videoId: "6C0sLtw5ctc",
    subtopics: ["Porter Stemmer", "Snowball Stemmer", "Suffix stripping", "Over-stemming", "Under-stemming"],
    intuition: `Stemming is a crude heuristic process that chops off word endings to reduce words to a common base form (the "stem").

Goal: Map morphological variants to one root form.

Examples (Porter Stemmer):
  "running"   → "run"
  "studies"   → "studi"   ← not a real word!
  "happiness" → "happi"   ← not a real word!
  "flies"     → "fli"     ← not a real word!

Types:
  Porter Stemmer:   Most common, aggressive
  Snowball Stemmer: Improved Porter, multilingual
  Lancaster:        Very aggressive, fast

Problems:
  Over-stemming:  "university" + "universe" → both → "univers" (different concepts merged)
  Under-stemming: "data" and "datum" may not be stemmed to the same root`,
    advantages: [
      "Very fast — simple rule-based suffix stripping",
      "Reduces vocabulary size effectively",
      "Good enough for search/retrieval tasks where exact form doesn't matter"
    ],
    disadvantages: [
      "Produces non-real words ('studi', 'happi') — outputs are not dictionary words",
      "Language-dependent — different stemmers needed for Hindi, French, etc.",
      "Over-stemming can collapse semantically different words to the same stem"
    ],
    bestPractices: [
      "Use Lemmatization instead of Stemming for tasks where interpretability matters",
      "Stemming is suitable for information retrieval where speed matters more than accuracy",
      "Never use stemming before Named Entity Recognition — proper nouns get corrupted"
    ],
    code: `from nltk.stem import PorterStemmer, SnowballStemmer

porter = PorterStemmer()
snowball = SnowballStemmer('english')

words = ["running", "studies", "happiness", "flies", "better"]

print("Porter Stemmer:")
for w in words:
    print(f"  {w} → {porter.stem(w)}")

print("\\nSnowball Stemmer:")
for w in words:
    print(f"  {w} → {snowball.stem(w)}")
# Porter: running→run, studies→studi, happiness→happi
# Snowball: slightly better, consistent results`
  },

  {
    id: "lemmatization",
    name: "Lemmatization",
    lectureNum: 3,
    category: "preprocessing",
    categoryName: "Text Preprocessing",
    videoId: "6C0sLtw5ctc",
    subtopics: ["WordNet Lemmatizer", "POS-aware lemmatization", "Lemma vs Stem", "spaCy lemmatization"],
    intuition: `Lemmatization reduces words to their dictionary base form (the "lemma") using vocabulary and morphological analysis.

Unlike stemming, lemmatization always produces real dictionary words:

  "running"  → "run"       ← uses POS: verb form
  "studies"  → "study"     ← real word!
  "better"   → "good"      ← understands comparative forms
  "flies"    → "fly"       ← real word!
  "went"     → "go"        ← handles irregular verbs

Requires Part-of-Speech (POS) tag to work correctly:
  "running" as NOUN → "running" (gerund, not simplified)
  "running" as VERB → "run"

WordNet Lemmatizer (NLTK) needs explicit POS tags.
spaCy performs automatic POS + Lemmatization together.`,
    advantages: [
      "Always produces real dictionary words — interpretable output",
      "Better for tasks where word meaning matters (sentiment, classification)",
      "Handles irregular word forms correctly (went→go, better→good)"
    ],
    disadvantages: [
      "Slower than stemming — requires lexicon lookup and POS tagging",
      "Requires POS tags to work correctly (NLTK WordNetLemmatizer is POS-unaware by default)",
      "Language-specific — needs different WordNet or model for each language"
    ],
    bestPractices: [
      "Always pass the POS tag to NLTK WordNetLemmatizer for correct results",
      "Use spaCy for production — it does POS + Lemmatization automatically in one pass",
      "Lemmatize AFTER stopword removal to avoid wasting compute on common words"
    ],
    code: `# Method 1: NLTK WordNetLemmatizer (needs POS tag)
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
nltk.download(['wordnet', 'averaged_perceptron_tagger'])

lemmatizer = WordNetLemmatizer()

# Correct: pass POS tag
print(lemmatizer.lemmatize("running", pos=wordnet.VERB))  # run
print(lemmatizer.lemmatize("better", pos=wordnet.ADJ))    # good

# Wrong (no POS): 
print(lemmatizer.lemmatize("running"))  # running (not lemmatized!)

# Method 2: spaCy (recommended - auto POS tagging)
import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp("The striped bats are hanging on their feet for best")
lemmas = [(token.text, token.lemma_) for token in doc]
print(lemmas)`
  },

  // ─────────────────────────────────────────────
  // LECTURE 4 — Text Representation
  // ─────────────────────────────────────────────
  {
    id: "bag-of-words",
    name: "Bag of Words (BoW)",
    lectureNum: 4,
    category: "representation",
    categoryName: "Text Representation",
    videoId: "vo6gQz5lYRI",
    subtopics: ["Count Matrix", "Vocabulary", "Sparse Vectors", "CountVectorizer"],
    intuition: `Bag of Words (BoW) converts text into a fixed-size numeric vector by counting word occurrences.

Process:
  1. Build vocabulary from all documents (all unique words)
  2. Represent each document as a count vector over the vocabulary

Example:
  Corpus:
    Doc1: "I love NLP"
    Doc2: "I love Python"
    Doc3: "NLP is awesome"

  Vocabulary: ["I", "NLP", "Python", "awesome", "is", "love"]

  Doc1 → [1, 1, 0, 0, 0, 1]
  Doc2 → [1, 0, 1, 0, 0, 1]
  Doc3 → [0, 1, 0, 1, 1, 0]

Key Insight: Word order is lost — "dog bites man" and "man bites dog" give the same vector!
Hence "Bag" of Words — just counts, no sequence.`,
    advantages: [
      "Simple, fast, and easy to implement",
      "Works surprisingly well for many classification tasks",
      "Sparse matrix can be stored efficiently (scipy sparse)"
    ],
    disadvantages: [
      "Loses word order completely ('good not bad' = 'bad not good')",
      "Ignores semantic meaning (synonyms treated as different features)",
      "Vocabulary can be enormous for large corpora → high-dimensional sparse vectors",
      "All words treated equally — common words dominate over rare but meaningful words"
    ],
    bestPractices: [
      "Use max_features in CountVectorizer to cap vocabulary size (e.g., 10,000)",
      "Combine with TF-IDF instead of raw counts for better discrimination",
      "Use n-grams (bigrams/trigrams) to partially capture word order"
    ],
    code: `from sklearn.feature_extraction.text import CountVectorizer

corpus = [
    "I love NLP",
    "I love Python",
    "NLP is awesome"
]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(corpus)

print("Vocabulary:", vectorizer.vocabulary_)
print("Feature Names:", vectorizer.get_feature_names_out())
print("\\nBoW Matrix:\\n", X.toarray())

# With n-grams (bigrams)
vec_bigram = CountVectorizer(ngram_range=(1, 2), max_features=1000)
X_bigram = vec_bigram.fit_transform(corpus)
print("\\nBigram features:", vec_bigram.get_feature_names_out()[:10])`
  },

  {
    id: "tfidf",
    name: "TF-IDF",
    lectureNum: 4,
    category: "representation",
    categoryName: "Text Representation",
    videoId: "vo6gQz5lYRI",
    subtopics: ["Term Frequency", "Inverse Document Frequency", "TF-IDF Score", "TfidfVectorizer"],
    intuition: `TF-IDF (Term Frequency - Inverse Document Frequency) measures how important a word is to a document relative to the whole corpus.

TF (Term Frequency) — How often does a word appear in THIS document?
  TF(t, d) = (count of t in d) / (total words in d)

IDF (Inverse Document Frequency) — How rare is the word across ALL documents?
  IDF(t) = log(N / df(t))
  where N = total documents, df(t) = documents containing t

TF-IDF Score:
  TF-IDF(t, d) = TF(t, d) × IDF(t)

Intuition:
  • "the" appears in all documents → IDF ≈ 0 → low TF-IDF (filtered out naturally)
  • "quantum" appears in 1/1000 docs → high IDF → high TF-IDF in that document

Key difference from BoW:
  BoW: count("the") = 15 → high (misleading)
  TF-IDF: score("the") ≈ 0 → low (correct — it's not informative)`,
    advantages: [
      "Naturally down-weights common/stopwords without explicit removal",
      "Highlights words that are truly discriminative for a specific document",
      "Much better than raw BoW for document classification and retrieval"
    ],
    disadvantages: [
      "Still ignores word order and semantic meaning (synonyms = different features)",
      "Does not handle polysemy — 'bank' in finance vs geography",
      "IDF penalizes words appearing in many docs — can hurt for general domain models"
    ],
    bestPractices: [
      "Use sublinear_tf=True in TfidfVectorizer for large corpora (uses log(TF) to dampen high counts)",
      "Set min_df and max_df to filter out very rare and very common terms",
      "Combine with cosine similarity for document search/retrieval tasks"
    ],
    code: `from sklearn.feature_extraction.text import TfidfVectorizer

corpus = [
    "the quick brown fox jumps over the lazy dog",
    "the dog ate my homework",
    "machine learning is awesome for NLP tasks"
]

tfidf = TfidfVectorizer(
    ngram_range=(1, 2),    # unigrams + bigrams
    max_features=5000,
    sublinear_tf=True,     # use log(1+tf)
    min_df=1,              # word must appear in at least 1 doc
    max_df=0.95            # ignore words in >95% of docs
)

X = tfidf.fit_transform(corpus)
feature_names = tfidf.get_feature_names_out()

# Show top features for doc 0
import numpy as np
scores = zip(feature_names, X[0].toarray()[0])
sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
for word, score in sorted_scores[:5]:
    print(f"  {word}: {score:.3f}")`
  },

  {
    id: "ngrams",
    name: "N-Grams",
    lectureNum: 4,
    category: "representation",
    categoryName: "Text Representation",
    videoId: "vo6gQz5lYRI",
    subtopics: ["Unigrams", "Bigrams", "Trigrams", "Language Models", "Perplexity"],
    intuition: `N-Grams are contiguous sequences of N items (words or characters) from text. They partially restore the word order lost in BoW.

Types:
  Unigram (N=1): ["I", "love", "NLP"]
  Bigram  (N=2): ["I love", "love NLP"]
  Trigram (N=3): ["I love NLP"]

Why N-Grams matter:
  "not good" → as unigram: ["not", "good"] → conflicted signal
  "not good" → as bigram:  ["not good"]    → clear negative signal!

Applications:
  • Text representation in BoW/TF-IDF pipelines
  • Language modeling: P("NLP" | "I love") = ?
  • Spell checking: character n-grams
  • Plagiarism detection: shingling (overlapping n-grams)

N-Gram Language Models:
  P(sentence) = P(w1) × P(w2|w1) × P(w3|w1,w2) × ...
  (Markov assumption: only look back N-1 words)`,
    advantages: [
      "Captures local word context (bigrams for phrases like 'New York', 'not good')",
      "Character n-grams are robust to spelling errors and new words",
      "Simple and effective baseline for many NLP tasks"
    ],
    disadvantages: [
      "Vocabulary size explodes with higher N (V^N possible n-grams)",
      "Cannot capture long-range dependencies (need Transformers for that)",
      "Sparse — most n-gram combinations never appear in training data"
    ],
    bestPractices: [
      "Bigrams (1,2) is the sweet spot — captures phrases without exploding vocabulary",
      "Use character n-grams for noisy social media text, usernames, hashtags",
      "For language models, use Kneser-Ney smoothing to handle zero-count n-grams"
    ],
    code: `from sklearn.feature_extraction.text import TfidfVectorizer
from nltk import ngrams
import nltk

# sklearn n-grams in vectorizer
tfidf_ngram = TfidfVectorizer(ngram_range=(1, 3))  # unigram to trigrams
texts = ["not good movie", "very good movie", "not a bad movie"]
X = tfidf_ngram.fit_transform(texts)
print("N-gram features:", tfidf_ngram.get_feature_names_out())

# NLTK manual n-grams
tokens = ["I", "love", "natural", "language", "processing"]
bigrams = list(ngrams(tokens, 2))
trigrams = list(ngrams(tokens, 3))
print("\\nBigrams:", bigrams)
print("Trigrams:", trigrams)`
  },

  // ─────────────────────────────────────────────
  // LECTURE 5 — Word2Vec
  // ─────────────────────────────────────────────
  {
    id: "word2vec-overview",
    name: "Word2Vec — Dense Word Embeddings",
    lectureNum: 5,
    category: "embeddings",
    categoryName: "Word Embeddings",
    videoId: "DDfLc5AHoJI",
    subtopics: ["Distributional Hypothesis", "Dense Vectors", "Semantic Similarity", "Word Algebra"],
    intuition: `Word2Vec learns dense vector representations of words so that semantically similar words have similar vectors.

Core Idea — Distributional Hypothesis:
  "You shall know a word by the company it keeps" (J.R. Firth, 1957)
  Words that appear in similar contexts have similar meanings.

  "King" and "Queen" both appear near: palace, crown, throne, royal
  → Their vectors should be close in embedding space

Vector Arithmetic:
  king - man + woman ≈ queen   ← Famous example!
  Paris - France + Italy ≈ Rome

Why Word2Vec > BoW/TF-IDF:
  BoW: "good" and "great" → completely different vectors (no relation)
  Word2Vec: "good" and "great" → very close vectors (semantic similarity)

Embedding Space: Each word → a point in 100/200/300 dimensional space.
Similar words cluster together.`,
    advantages: [
      "Captures semantic relationships (synonyms are close in vector space)",
      "Dense compact representations (300d) vs BoW sparse (10,000d+)",
      "Word algebra works: king - man + woman ≈ queen",
      "Pre-trained embeddings transfer well across domains"
    ],
    disadvantages: [
      "Each word gets ONE vector — cannot handle polysemy ('bank' always same vector)",
      "Out-of-Vocabulary (OOV) words have no representation",
      "Training requires large corpora (billions of words for good quality)",
      "Replaced by contextual embeddings (BERT) for state-of-the-art tasks"
    ],
    bestPractices: [
      "Use pre-trained Word2Vec (Google News 3M words) instead of training from scratch unless you have domain-specific data",
      "Normalize embeddings (unit vectors) before computing cosine similarity",
      "For OOV words, use the average of character n-gram vectors (FastText handles this)"
    ],
    code: `# Using pre-trained Word2Vec via Gensim
import gensim.downloader as api

# Download pre-trained model (3.6GB, 3M words, 300d)
# model = api.load("word2vec-google-news-300")

# Using smaller pre-trained model for demo
model = api.load("glove-wiki-gigaword-50")  # 50-dim GloVe

# Most similar words
print(model.most_similar("king", topn=5))

# Word algebra
result = model.most_similar(positive=["king", "woman"], negative=["man"])
print("king - man + woman =", result[0][0])  # queen

# Semantic similarity
print("Similarity(good, great):", model.similarity("good", "great"))
print("Similarity(good, terrible):", model.similarity("good", "terrible"))`
  },

  {
    id: "cbow",
    name: "CBOW — Continuous Bag of Words",
    lectureNum: 5,
    category: "embeddings",
    categoryName: "Word Embeddings",
    videoId: "DDfLc5AHoJI",
    subtopics: ["Context Window", "Center Word Prediction", "Hidden Layer", "Averaging"],
    intuition: `CBOW (Continuous Bag of Words) is one of two Word2Vec architectures. It predicts the CENTER word given its surrounding context words.

Architecture:
  Context words (one-hot) → Average → Hidden Layer → Softmax → Center word

Example (window=2):
  Sentence: "The cat sat on mat"
  For center word "sat":
    Context: ["The", "cat", "on", "mat"]
    Task: Predict "sat" given those 4 context words

Training:
  1. One-hot encode all context words
  2. Average their embeddings (hence "Bag")
  3. Pass through hidden layer (weight matrix W = embeddings!)
  4. Softmax → predict which word is the center
  5. Backpropagate error → update W
  6. After training, W is our word embedding matrix

The "Bag" part: CBOW averages the context, losing word order within the window.`,
    advantages: [
      "Faster to train than Skip-gram (averages context instead of processing each pair)",
      "Works better for frequent words with lots of training data",
      "Lower memory footprint during training"
    ],
    disadvantages: [
      "Averaging context loses fine-grained word order information",
      "Less effective than Skip-gram for rare words and small datasets",
      "Cannot handle polysemy — one word = one vector regardless of context"
    ],
    bestPractices: [
      "Use CBOW when you have a large corpus and need faster training",
      "Use window_size=5 for syntactic relationships, window_size=10+ for semantic",
      "Use negative_sampling=5-20 for faster training than full Softmax"
    ],
    code: `from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize, sent_tokenize
import nltk
nltk.download('punkt')

corpus = """
Natural language processing enables computers to understand human language.
Word embeddings capture semantic meaning of words.
CBOW predicts the center word from surrounding context.
"""

# Tokenize into sentences of words
sentences = [word_tokenize(sent.lower()) for sent in sent_tokenize(corpus)]

# Train CBOW model
cbow_model = Word2Vec(
    sentences,
    vector_size=100,    # embedding dimensions
    window=5,           # context window size
    min_count=1,        # ignore words with freq < min_count
    sg=0,               # 0=CBOW, 1=Skip-gram
    epochs=100
)

print("Vector for 'language':", cbow_model.wv['language'][:5])
print("Similar to 'word':", cbow_model.wv.most_similar('word', topn=3))`
  },

  {
    id: "skipgram",
    name: "Skip-gram",
    lectureNum: 5,
    category: "embeddings",
    categoryName: "Word Embeddings",
    videoId: "DDfLc5AHoJI",
    subtopics: ["Context-Center Prediction", "Negative Sampling", "Window Size", "Rare Words"],
    intuition: `Skip-gram is the second Word2Vec architecture. It does the reverse of CBOW — predicts CONTEXT words given the CENTER word.

Architecture:
  Center word (one-hot) → Hidden Layer → Softmax → Context words

Example (window=2):
  Sentence: "The cat sat on mat"
  For center word "sat":
    Task: Predict ["The", "cat", "on", "mat"] from "sat"
    Generates 4 (center, context) training pairs:
      ("sat", "The"), ("sat", "cat"), ("sat", "on"), ("sat", "mat")

Key Insight: Skip-gram treats each context word as a separate prediction.
CBOW averages everything — Skip-gram makes N_context separate predictions.

Training Optimization — Negative Sampling:
  Full Softmax over 10M vocabulary is expensive!
  Negative sampling: instead of full softmax, predict:
    • Is ("sat", "cat") a real pair? → YES
    • Is ("sat", "pizza") a real pair? → NO
  Sample K random "negative" words per positive pair.`,
    advantages: [
      "Better for rare words — each word gets more training signal",
      "Learns higher quality embeddings on small datasets",
      "Works well even with limited data per word"
    ],
    disadvantages: [
      "Slower to train than CBOW (more (center, context) pairs generated)",
      "Requires negative sampling optimization for large vocabularies",
      "Still produces static embeddings — no context-awareness"
    ],
    bestPractices: [
      "Use Skip-gram (sg=1) for domain-specific data with rare technical terms",
      "Set negative=5 for small datasets, negative=2 for large datasets",
      "Subsample frequent words (sample=1e-3) to speed up training"
    ],
    code: `from gensim.models import Word2Vec

# Train Skip-gram model
sentences = [
    ["natural", "language", "processing", "is", "fascinating"],
    ["word", "embeddings", "capture", "semantic", "meaning"],
    ["skip", "gram", "predicts", "context", "from", "center", "word"],
]

skipgram_model = Word2Vec(
    sentences,
    vector_size=100,
    window=5,
    min_count=1,
    sg=1,           # 1 = Skip-gram (0 = CBOW)
    negative=5,     # negative sampling: 5 random negative words
    sample=1e-3,    # subsampling frequent words
    epochs=100
)

# Evaluate
print("Most similar to 'word':")
print(skipgram_model.wv.most_similar('word', topn=3))

# Save and load model
skipgram_model.save("skipgram_nlp.model")
loaded = Word2Vec.load("skipgram_nlp.model")`
  },

  // ─────────────────────────────────────────────
  // LECTURE 6 — Text Classification
  // ─────────────────────────────────────────────
  {
    id: "text-classification",
    name: "Text Classification Pipeline",
    lectureNum: 6,
    category: "classification",
    categoryName: "Text Classification",
    videoId: "Qbd7U9F0QQ8",
    subtopics: ["Sentiment Analysis", "Spam Detection", "Train/Test Split", "Evaluation Metrics"],
    intuition: `Text Classification assigns predefined categories/labels to text documents.

Common Tasks:
  Sentiment Analysis:  "Great product!" → Positive
  Spam Detection:      "Congratulations! You won!" → Spam
  Topic Classification: Article → Politics / Sports / Tech
  Intent Detection:     "Book a flight" → travel_booking

Standard Pipeline:
  Raw Text
    ↓ Preprocessing (clean, tokenize, remove stopwords)
    ↓ Feature Extraction (TF-IDF / Word2Vec / BERT)
    ↓ Model Training (Naive Bayes / SVM / Logistic Regression / DNN)
    ↓ Evaluation (Accuracy, F1, AUC)
    ↓ Deployment

Key Metrics for Text Classification:
  Accuracy: Overall correct predictions
  Precision: TP / (TP + FP) — when predicted positive, how often correct?
  Recall: TP / (TP + FN) — of all positives, how many did we catch?
  F1 Score: Harmonic mean of Precision and Recall
  AUC-ROC: Overall ranking quality`,
    advantages: [
      "Automates document categorization at scale (millions of emails, reviews, tickets)",
      "TF-IDF + Logistic Regression is a very strong baseline",
      "Pre-trained BERT fine-tuning achieves near-human performance on many tasks"
    ],
    disadvantages: [
      "Needs labeled training data — expensive to create",
      "Class imbalance is common in real text datasets (e.g., 99% non-spam)",
      "Domain shift: model trained on reviews fails on tweets"
    ],
    bestPractices: [
      "Always start with a simple baseline (TF-IDF + Naive Bayes) before trying deep models",
      "Use stratified train/test split to preserve class distribution",
      "For imbalanced classes, optimize F1/AUC not accuracy"
    ],
    code: `from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import numpy as np

# Data (movie reviews)
texts = [
    "This movie is absolutely fantastic and wonderful",
    "Terrible film, complete waste of money",
    "Great acting and brilliant storyline",
    "Boring and predictable, skip this one",
    "Loved every minute of this masterpiece",
    "Dull and uninspiring, not recommended"
]
labels = [1, 0, 1, 0, 1, 0]

X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.33, random_state=42, stratify=labels
)

# Pipeline
pipe = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)),
    ('clf', LogisticRegression(C=1.0))
])

pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_test)
print(classification_report(y_test, y_pred))`
  },

  {
    id: "avg-word2vec",
    name: "Average Word2Vec for Classification",
    lectureNum: 6,
    category: "classification",
    categoryName: "Text Classification",
    videoId: "Qbd7U9F0QQ8",
    subtopics: ["Document Vector", "Averaging Embeddings", "Word2Vec + ML", "Semantic Features"],
    intuition: `To use Word2Vec for text classification, we need one vector per document (not per word).

Approach: Average all word vectors in the document.

  Document: "I love natural language processing"
  Word vectors: v("I") + v("love") + v("natural") + v("language") + v("processing")
  Avg vector: sum of all vectors / 5

  Result: One 300-dimensional vector per document.

Why averaging works:
  Words that frequently appear together pull the document vector toward their cluster.
  A positive review with many positive words → vector in the "positive" region.

Limitations:
  • Negation is lost: "not good" → average of "not" and "good" (noise!)
  • Word order ignored (same as BoW in that sense)
  • OOV words have no vector → skip them

Better Alternatives:
  TF-IDF weighted average: weight each word vector by its TF-IDF score
  Doc2Vec: directly train document-level vectors
  BERT [CLS] token: contextual document representation`,
    advantages: [
      "Captures semantic meaning — synonyms contribute similar signal",
      "Dense 100-300d features vs sparse 10,000d+ TF-IDF vectors",
      "Works reasonably well even with simple averaging"
    ],
    disadvantages: [
      "Averaging loses word order and negation information",
      "OOV words are silently skipped — can corrupt meaning for rare-word-heavy domains",
      "TF-IDF + LR often outperforms Avg-W2V for short text"
    ],
    bestPractices: [
      "Use TF-IDF weighted averaging instead of simple averaging for better results",
      "Handle OOV words explicitly — either skip or use a zero vector",
      "Normalize document vectors before training classifiers"
    ],
    code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import gensim.downloader as api

# Load pre-trained model
w2v = api.load("glove-wiki-gigaword-50")

def get_avg_vector(text, model, dim=50):
    words = text.lower().split()
    vectors = [model[w] for w in words if w in model]
    if not vectors:
        return np.zeros(dim)
    return np.mean(vectors, axis=0)

texts = [
    "I love this amazing product",
    "Terrible experience, never again",
    "Great quality and fast shipping",
    "Waste of money, very disappointed"
]
labels = [1, 0, 1, 0]

# Convert all documents to average vectors
X = np.array([get_avg_vector(t, w2v) for t in texts])
print("Feature matrix shape:", X.shape)  # (4, 50)

X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.25)
clf = LogisticRegression()
clf.fit(X_train, y_train)
print("Predictions:", clf.predict(X_test))`
  },

  // ─────────────────────────────────────────────
  // LECTURE 7 — POS Tagging & HMMs
  // ─────────────────────────────────────────────
  {
    id: "pos-tagging",
    name: "POS Tagging",
    lectureNum: 7,
    category: "sequence",
    categoryName: "Sequence Modeling",
    videoId: "269IGagoJfs",
    subtopics: ["Penn Treebank Tags", "Noun/Verb/Adjective", "spaCy POS", "Use Cases"],
    intuition: `Part-of-Speech (POS) Tagging assigns grammatical labels to each word in a sentence.

Common POS Tags (Penn Treebank):
  NN   — Noun, singular ("cat", "dog")
  NNS  — Noun, plural ("cats")
  NNP  — Proper noun ("London", "Harry")
  VB   — Verb, base form ("eat")
  VBD  — Verb, past tense ("ate")
  VBG  — Verb, gerund ("eating")
  JJ   — Adjective ("beautiful")
  RB   — Adverb ("quickly")
  DT   — Determiner ("the", "a")
  IN   — Preposition ("in", "on", "at")
  CC   — Coordinating conjunction ("and", "or")

Why POS Tagging matters:
  Disambiguation: "book a flight" (VB=book) vs "read a book" (NN=book)
  Lemmatization: Need POS to know: "running" → "run" (verb) vs "running" (noun)
  Feature Engineering: POS counts as features for classification
  Information Extraction: Find [Adjective + Noun] patterns`,
    advantages: [
      "Essential for correct lemmatization (verb vs noun form matters)",
      "Disambiguates word sense in downstream tasks",
      "Useful features for NER, parsing, and relation extraction"
    ],
    disadvantages: [
      "Context-dependent — same word can have different POS in different sentences",
      "Accuracy drops on domain-specific text (medical, legal) without domain training",
      "Language-specific — different tagsets for different languages"
    ],
    bestPractices: [
      "Use spaCy for POS tagging — it is faster and more accurate than NLTK for most languages",
      "Always use POS tags when calling WordNetLemmatizer for correct lemmatization",
      "For domain-specific text, fine-tune POS models on domain data"
    ],
    code: `import nltk
import spacy
nltk.download(['averaged_perceptron_tagger', 'punkt'])

text = "The dog quickly ate the fresh fish near the river bank"

# NLTK POS tagging
tokens = nltk.word_tokenize(text)
pos_tags = nltk.pos_tag(tokens)
print("NLTK POS tags:")
for word, tag in pos_tags:
    print(f"  {word:10} → {tag}")

# spaCy POS (recommended — also gives dependency parsing)
nlp = spacy.load("en_core_web_sm")
doc = nlp(text)
print("\\nspaCy POS tags:")
for token in doc:
    print(f"  {token.text:10} → {token.pos_:6} ({token.tag_})")`
  },

  {
    id: "hmm",
    name: "Hidden Markov Models (HMM)",
    lectureNum: 7,
    category: "sequence",
    categoryName: "Sequence Modeling",
    videoId: "269IGagoJfs",
    subtopics: ["States", "Observations", "Emission Probability", "Transition Probability", "POS with HMM"],
    intuition: `Hidden Markov Models (HMMs) model sequential data where the underlying state is hidden but produces observable outputs.

For POS Tagging:
  Hidden States:    POS tags (NN, VB, JJ, ...)
  Observations:     Words (cat, eat, beautiful, ...)

Two Key Probabilities:
  1. Transition Probability: P(tag_t | tag_{t-1})
     How likely is it to go from one POS to another?
     P(NN | DT) = 0.7   (Determiner → Noun is common)
     P(VB | VB) = 0.1   (Verb → Verb is less common)

  2. Emission Probability: P(word | tag)
     Given a POS tag, how likely is this word?
     P("cat" | NN) = 0.003
     P("the"  | DT) = 0.7

  3. Initial Probability: P(first tag)
     P(DT at start) = 0.15

HMM predicts: Given sequence of words [w1, w2, ..., wN],
find the most likely sequence of tags [t1, t2, ..., tN].`,
    advantages: [
      "Principled probabilistic framework — interpretable probabilities",
      "Effective for POS tagging and Named Entity Recognition",
      "Works well with small amounts of labeled training data"
    ],
    disadvantages: [
      "Markov assumption: only considers previous state (not longer context)",
      "Cannot model long-range dependencies",
      "Replaced by BiLSTM-CRF and BERT for state-of-the-art sequence labeling"
    ],
    bestPractices: [
      "HMMs are a great baseline and teaching tool for sequence labeling",
      "Use CRFs for better accuracy when you need production-quality POS tagging",
      "Smoothing (Laplace/Good-Turing) is essential for zero-count transitions/emissions"
    ],
    code: `# HMM-based POS Tagging using NLTK
import nltk
from nltk.corpus import brown
nltk.download(['brown', 'universal_tagset'])

# Load POS-tagged corpus
tagged_sents = brown.tagged_sents(tagset='universal')

# Build transition and emission probabilities
from collections import defaultdict, Counter

# Count transitions P(tag_t | tag_{t-1})
transitions = defaultdict(Counter)
emissions = defaultdict(Counter)

for sent in tagged_sents:
    prev_tag = '<START>'
    for word, tag in sent:
        transitions[prev_tag][tag] += 1
        emissions[tag][word.lower()] += 1
        prev_tag = tag

# P(NOUN | DET) — how often Noun follows Determiner
det_total = sum(transitions['DET'].values())
print("P(NOUN|DET):", transitions['DET']['NOUN'] / det_total)

# Use spaCy for production (it uses ML, not rule-based HMM)
import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp("The cat ate the fish quickly")
print([(t.text, t.pos_) for t in doc])`
  },

  {
    id: "viterbi",
    name: "Viterbi Algorithm",
    lectureNum: 7,
    category: "sequence",
    categoryName: "Sequence Modeling",
    videoId: "269IGagoJfs",
    subtopics: ["Dynamic Programming", "Decoding", "Best Path", "Sequence Labeling"],
    intuition: `The Viterbi Algorithm is a dynamic programming algorithm that finds the most likely sequence of hidden states (POS tags) given a sequence of observations (words) in an HMM.

Problem: Given ["The", "cat", "ate"]
Find: Most likely tag sequence [DT, NN, VB]

Brute Force: Try all possible tag sequences → O(|T|^N) — exponential!
Viterbi: Dynamic programming → O(|T|² × N) — polynomial!

Key Idea:
  At each word position t, store the best probability to reach each tag.
  viterbi[t][tag] = max over all prev_tags of:
      viterbi[t-1][prev_tag] × P(tag | prev_tag) × P(word_t | tag)

  Also store backpointer[t][tag] = which prev_tag gave the max
  After reaching end, backtrack through pointers to get the best path.

Intuition: "I don't need to remember HOW I got to a state, 
only the BEST probability of being in that state."`,
    advantages: [
      "Finds the globally optimal tag sequence — not greedy",
      "Polynomial time vs exponential brute force",
      "Used in speech recognition, OCR, and bioinformatics too"
    ],
    disadvantages: [
      "Still limited by the Markov assumption (bigram context only)",
      "Must enumerate all states at each step — slow for very large state spaces",
      "For production, neural models (CRF, BiLSTM) outperform HMM+Viterbi"
    ],
    bestPractices: [
      "Implement in log-space (sum log probs instead of multiply probs) to avoid numerical underflow",
      "Add smoothing to all probabilities before running Viterbi",
      "Use the Viterbi concept even in neural CRFs — same dynamic programming principle applies"
    ],
    code: `import numpy as np

def viterbi(obs, states, start_p, trans_p, emit_p):
    """
    obs:     list of observed words
    states:  list of possible POS tags
    start_p: {tag: initial_prob}
    trans_p: {tag: {next_tag: prob}}
    emit_p:  {tag: {word: prob}}
    """
    N = len(obs)
    T = len(states)
    
    # dp[t][s] = best prob at time t being in state s
    dp = np.zeros((N, T))
    backptr = np.zeros((N, T), dtype=int)
    
    # Initialize
    for s, state in enumerate(states):
        dp[0][s] = start_p.get(state, 1e-10) * emit_p[state].get(obs[0], 1e-10)
    
    # Forward pass
    for t in range(1, N):
        for s, state in enumerate(states):
            probs = [dp[t-1][s2] * trans_p[states[s2]].get(state, 1e-10) 
                     * emit_p[state].get(obs[t], 1e-10)
                     for s2 in range(T)]
            dp[t][s] = max(probs)
            backptr[t][s] = np.argmax(probs)
    
    # Backtrack
    best_path = [np.argmax(dp[N-1])]
    for t in range(N-1, 0, -1):
        best_path.insert(0, backptr[t][best_path[0]])
    
    return [states[s] for s in best_path]

# Simplified example
states = ['DT', 'NN', 'VB']
obs = ['the', 'cat', 'ate']
start_p = {'DT': 0.6, 'NN': 0.3, 'VB': 0.1}
trans_p = {
    'DT': {'NN': 0.8, 'VB': 0.1, 'DT': 0.1},
    'NN': {'VB': 0.7, 'NN': 0.2, 'DT': 0.1},
    'VB': {'NN': 0.5, 'DT': 0.3, 'VB': 0.2},
}
emit_p = {
    'DT': {'the': 0.8, 'cat': 0.01, 'ate': 0.01},
    'NN': {'cat': 0.4, 'the': 0.01, 'ate': 0.05},
    'VB': {'ate': 0.6, 'cat': 0.01, 'the': 0.01},
}
print(viterbi(obs, states, start_p, trans_p, emit_p))
# → ['DT', 'NN', 'VB']`
  }
];

// Screenshot mapping: key = lecture number, value = array of screenshot filenames in ss/ folder
// Prefix of filename = lecture index
const SS_MAPPING = {
  1: [
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0002.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0003.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0004.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0005.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0006.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0007.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0008.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0009.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0010.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0011.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0012.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0013.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0014.png",
    "001 - Introduction to NLP ｜ NLP Lecture 1 ｜ End to End NLP Course-0015.png"
  ],
  2: [
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0016.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0018.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0019.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0020.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0022.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0023.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0024.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0025.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0026.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0027.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0028.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0030.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0031.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0032.png",
    "002 - End to End NLP Pipeline ｜ NLP Pipeline ｜ Lecture 2 NLP Course-0033.png"
  ],
  3: [
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0001.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0002.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0003.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0004.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0007.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0008.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0009.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0011.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0012.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0013.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0014.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0015.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0016.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0017.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0018.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0019.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0020.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0021.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0022.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0023.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0024.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0025.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0026.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0027.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0028.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0029.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0030.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0031.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0034.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0035.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0036.png",
    "003 - Text Preprocessing ｜ NLP Course Lecture 3-0038.png"
  ],
  4: [
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0039.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0041.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0042.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0043.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0044.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0045.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0047.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0048.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0049.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0051.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0053.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0054.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0055.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0056.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0059.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0060.png",
    "004 - Text Representation ｜ NLP Lecture 4 ｜ Bag of Words ｜ Tf-Idf ｜ N-grams, Bi-grams and Uni-grams-0063.png"
  ],
  5: [
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0064.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0065.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0066.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0067.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0068.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0069.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0070.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0071.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0072.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0074.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0075.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0076.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0079.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0080.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0082.png",
    "005 - Word2vec Complete Tutorial ｜ CBOW and Skip-gram ｜ Game of Thrones Word2vec-0083.png"
  ],
  6: [
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0001.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0002.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0004.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0005.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0007.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0008.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0009.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0010.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0012.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0013.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0014.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0015.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0016.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0017.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0018.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0019.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0020.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0021.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0022.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0024.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0025.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0027.png",
    "006 - Text Classification ｜ NLP Lecture 6 ｜ End to End ｜ Average Word2Vec-0029.png"
  ],
  7: [
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0030.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0031.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0032.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0033.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0035.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0036.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0037.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0038.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0040.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0041.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0042.png",
    "007 - POS Tagging ｜ Part of Speech Tagging in NLP ｜ Hidden Markov Models in NLP ｜ Viterbi Algorithm in NLP-0043.png"
  ]
};

// NLP Decision Wizard for "what should I use?" questions
const NLP_WIZARD_NODES = {
  start: {
    question: "What NLP task are you working on?",
    tip: "Tip: NLP tasks span from preprocessing (cleaning text) to representation (converting to vectors) to modeling (classification, generation).",
    options: [
      { text: "Text Preprocessing — cleaning and normalizing raw text", next: "preprocess" },
      { text: "Text Representation — converting text to features for ML", next: "representation" },
      { text: "Text Classification — assigning labels to documents", next: "classification" },
      { text: "Sequence Labeling — tagging each word (POS, NER)", next: "sequence" }
    ]
  },
  preprocess: {
    question: "Which preprocessing step do you need?",
    tip: "Tip: Good preprocessing can improve model accuracy by 5-15%. Always apply the same preprocessing at training and inference time.",
    options: [
      { text: "Reduce words to base form (running → run)", next: "normalization" },
      { text: "Remove common uninformative words (the, is, at)", result: "stopwords" },
      { text: "Split text into individual words or sentences", result: "tokenization" },
      { text: "Remove HTML, URLs, special characters", result: "lowercasing" }
    ]
  },
  normalization: {
    question: "Do you need real dictionary words in output?",
    tip: "Tip: Stemming is faster but produces non-words ('happi'). Lemmatization is slower but always produces real words ('happy').",
    options: [
      { text: "Yes — real words matter (for interpretability or generation)", result: "lemmatization" },
      { text: "No — speed matters more (for retrieval or classification)", result: "stemming" }
    ]
  },
  representation: {
    question: "How much data do you have and do you need semantic similarity?",
    tip: "Tip: BoW/TF-IDF work well with limited data. Word2Vec needs a large corpus. BERT gives best results with GPU.",
    options: [
      { text: "Small data, need a simple fast baseline", next: "bow_or_tfidf" },
      { text: "Medium data, need semantic similarity between words", result: "word2vec-overview" },
      { text: "Large data, need best accuracy, have GPU", result: "avg-word2vec" }
    ]
  },
  bow_or_tfidf: {
    question: "Do you want to down-weight common words automatically?",
    tip: "Tip: TF-IDF is almost always better than raw BoW. Use BoW only when you specifically need raw counts.",
    options: [
      { text: "Yes — TF-IDF automatically penalizes frequent, uninformative words", result: "tfidf" },
      { text: "No — I specifically need raw word counts", result: "bag-of-words" }
    ]
  },
  classification: {
    question: "What type of features are you using?",
    tip: "Tip: TF-IDF features work best with Logistic Regression or SVM. Dense embeddings (Word2Vec) work better with neural classifiers.",
    options: [
      { text: "TF-IDF / BoW sparse features (no word meaning needed)", result: "text-classification" },
      { text: "Word2Vec dense features (semantic meaning important)", result: "avg-word2vec" }
    ]
  },
  sequence: {
    question: "Do you need state-of-the-art accuracy or a transparent probabilistic model?",
    tip: "Tip: HMM with Viterbi is interpretable and fast. Modern approaches (BiLSTM-CRF, BERT) are more accurate.",
    options: [
      { text: "Transparent and explainable (HMM + Viterbi)", result: "hmm" },
      { text: "Highest accuracy (use spaCy / BERT-based NER)", result: "pos-tagging" }
    ]
  }
};

// NLP Diagnostic questions (concept traps to watch out for)
const NLP_DIAGNOSTIC_DB = {
  "tfidf": [
    {
      q: "Are you fitting TfidfVectorizer on both train AND test data together?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>CRITICAL: DATA LEAKAGE</b> — The IDF values are computed over all documents including test set. This leaks test information into training. Always fit on X_train only, then transform X_test.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — Correct! Fit on training data only (vectorizer.fit_transform(X_train)), then vectorizer.transform(X_test).", severity: "safe" }
      ]
    },
    {
      q: "Are you using raw TF-IDF scores for a long document collection (> 100 words per doc)?",
      options: [
        { text: "Yes", isTrap: false, feedback: "💡 <b>TIP</b> — Consider setting sublinear_tf=True. This uses log(1+tf) instead of raw tf, reducing the impact of words that appear many times in one document.", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — Good. For short documents, raw TF is fine.", severity: "safe" }
      ]
    }
  ],
  "bag-of-words": [
    {
      q: "Is word order important for your task (e.g., sentiment with negations)?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP</b> — BoW ignores all word order. 'not good' and 'good not' give identical vectors. Use n-grams (bigrams) or TF-IDF with ngram_range=(1,2) to capture local word order.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — BoW works well for topic classification where word order matters less.", severity: "safe" }
      ]
    }
  ],
  "stemming": [
    {
      q: "Do you need the output tokens to be readable real words?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP</b> — Stemming produces non-words ('studi', 'happi', 'fli'). If readability or interpretability matters, use Lemmatization instead.", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — Stemming is fine for search/retrieval tasks where exact form doesn't matter.", severity: "safe" }
      ]
    }
  ],
  "lemmatization": [
    {
      q: "Are you using NLTK WordNetLemmatizer without providing the POS tag?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP</b> — WordNetLemmatizer without POS defaults to treating everything as a noun. 'running'.lemmatize() → 'running' (not 'run'!). Always pass pos=wordnet.VERB for verbs.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — Good! Providing POS tags ensures correct lemmatization.", severity: "safe" }
      ]
    }
  ],
  "stopwords": [
    {
      q: "Is your task sentiment analysis or negation-heavy text?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP</b> — 'not', 'no', 'never' are in the default NLTK stopword list. Removing them flips sentiment: 'not good' → 'good'. Remove negations from your stopword list for sentiment tasks.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — For topic classification or retrieval, standard stopword removal is fine.", severity: "safe" }
      ]
    }
  ],
  "word2vec-overview": [
    {
      q: "Are you expecting Word2Vec to handle words it has never seen (OOV)?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP</b> — Word2Vec has no representation for unseen words. OOV words will raise a KeyError. Use FastText instead — it represents words as sums of character n-grams and can handle any word.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — If your vocabulary is well-covered by training data, Word2Vec works fine.", severity: "safe" }
      ]
    },
    {
      q: "Do you need context-aware embeddings? ('bank' = financial vs river)",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP</b> — Word2Vec gives ONE static vector per word regardless of context. 'Bank' in 'bank account' and 'river bank' get the same vector. Use BERT or other contextual models for polysemy.", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE</b> — For tasks where word context isn't critical (similarity, clustering), Word2Vec works great.", severity: "safe" }
      ]
    }
  ],
  "hmm": [
    {
      q: "Are you handling zero-probability transitions (a tag sequence never seen in training)?",
      options: [
        { text: "No (not handled)", isTrap: true, feedback: "⚠️ <b>TRAP</b> — Unseen transitions give P=0, which propagates through Viterbi and kills probability. Use Laplace (add-1) smoothing or Good-Turing smoothing for all zero-count entries.", severity: "danger" },
        { text: "Yes (smoothing applied)", isTrap: false, feedback: "✅ <b>SAFE</b> — Good! Smoothing is essential for HMMs to handle unseen test data gracefully.", severity: "safe" }
      ]
    }
  ]
};

const NLP_GENERAL_DIAGNOSTICS = [
  {
    q: "Are you using the same preprocessing pipeline for training and production/inference?",
    options: [
      { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE</b> — Train-serve consistency is critical. Any difference causes silent model degradation.", severity: "safe" },
      { text: "No", isTrap: true, feedback: "⚠️ <b>TRAP (TRAIN-SERVE SKEW)</b> — If training uses lowercasing but inference doesn't, the model sees different token distributions. This is one of the most common production ML bugs.", severity: "danger" }
    ]
  },
  {
    q: "Have you checked your dataset for class imbalance before training a text classifier?",
    options: [
      { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE</b> — Good! Imbalanced datasets require F1/AUC metrics and possibly oversampling or class weights.", severity: "safe" },
      { text: "No", isTrap: true, feedback: "⚠️ <b>TRAP</b> — Undetected class imbalance (e.g., 99% negative reviews) lets a dumb model predict 'negative' always and report 99% accuracy. Always check value_counts() first.", severity: "danger" }
    ]
  }
];
