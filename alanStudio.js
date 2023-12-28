// // {Name: Basic_example_for_AI_assistant}
// // {Description: Learn how to create a dialog script with voice/text commands and text corpus for question answering}
// // ff4cc28d02224807bd5bcc81e6a0fbca


// Use this sample to create your own voice/text commands
const API_KEY = "ff4cc28d02224807bd5bcc81e6a0fbca";
let savedArticles = [];
intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;
    
    if(p.source.value){
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(' ').join('-')}`;
        console.log(NEWS_API_URL)
    }
    
    api.axios.get(NEWS_API_URL).then((response)=>{
    let {articles} = response.data;
    if(!articles.length){
        p.play('Sorry, please try searching for news from a different source');
        return;
    }
    savedArticles = articles;
    p.play({command: 'newsHeadlines', articles});
    p.play(`Here are the (latest|recent) ${p.source.value}`);
    //p.play(articles.length)
    
    });
});

// search by term
intent('What\'s up with $(term* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;
    
    if(p.term.value){
        NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`;
        console.log(NEWS_API_URL)
    }
    
    api.axios.get(NEWS_API_URL).then((response)=>{
    let {articles} = response.data;
    if(!articles.length){
        p.play('Sorry, please try searching for news from a different source');
        return;
    }
    savedArticles = articles;
    p.play({command: 'newsHeadlines', articles});
    p.play(`Here are the (latest|recent) articles on ${p.term.value}`);
    //p.play(articles.length)
    
    });
});

// News by Categories
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`, (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=us`;
    
    if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`
    }
    
     api.axios.get(NEWS_API_URL).then((response)=>{
    let {articles} = response.data;
    if(!articles.length){
        p.play('Sorry, please try searching for news from a different source');
        return;
    }
    savedArticles = articles;
   p.play({ command: 'newHeadlines', articles });
        
        if(p.C.value) {
            p.play(`Here are the (latest|recent) articles on ${p.C.value}.`);        
        } else {
            p.play(`Here are the (latest|recent) news`);   
        }
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    
    })
    
});

const confirmation = context(() => {
    intent('yes', async (p) => {
        for(let i = 0; i < savedArticles.length; i++){
            p.play({ command: 'highlight', article: savedArticles[i]});
            p.play(`${savedArticles[i].title}`);
        }
    })
    
    intent('no', (p) => {
        p.play('Sure, sounds good to me.')
    })
})

intent('open (the|) (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value) {
        p.play({ command:'open', number: p.number.value, articles: savedArticles})
    }
})

intent('(go|) back', (p) => {
    p.play('Sure, going back');
    p.play({ command: 'newHeadlines', articles: []})
})