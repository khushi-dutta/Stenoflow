import json

new_dictations = [
    {
        'id': 'super-60-1',
        'title': 'Super-60: High Speed Drill 1',
        'description': 'Advanced dictation covering diverse vocabulary for pro level practice.',
        'text': 'The rapid development of modern infrastructure has necessitated a comprehensive review of our planning strategies. It is imperative that we consider both the economic benefits and the environmental impact of these large-scale projects. Furthermore, the integration of advanced technologies will require a workforce that is well-trained and adaptable.',
        'language': 'English',
        'wpm': 120,
        'category': 'Pro Level Super-60 Dictations',
        'difficulty': 'Advanced',
        'premium': False
    },
    {
        'id': 'eduquity-imp-1',
        'title': 'Eduquity: Important Passage 1',
        'description': 'Highly relevant passage focused on administrative matters.',
        'text': 'The committee has observed that the implementation of the new policy has led to significant improvements in efficiency. However, there are still some areas where further clarification is needed. We recommend that a dedicated task force be established to monitor progress and address any emerging challenges.',
        'language': 'English',
        'wpm': 100,
        'category': 'Most Important Dictations (Eduquity)',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'kc-1000-1',
        'title': 'KC Volume 1, Transcription 1',
        'description': 'Classic Kailash Chandra 1000 words passage for SSC Grade C.',
        'text': 'Mr. Deputy Speaker, Sir, I rise to support the budget proposals presented by the honourable Finance Minister. This budget is a balanced one and takes into account the needs of various sections of society. The emphasis on agricultural development is particularly welcome, as it forms the backbone of our economy. Furthermore, the provisions made for infrastructure development will undoubtedly create new employment opportunities and stimulate growth.',
        'language': 'English',
        'wpm': 100,
        'category': 'Kailash Chandra (1000 Words)',
        'difficulty': 'Advanced',
        'premium': False
    },
    {
        'id': 'kc-840-1',
        'title': 'KC Volume 2, Transcription 15',
        'description': 'Standard Kailash Chandra 840 words dictation.',
        'text': 'Sir, the honourable member has raised a very important issue regarding the availability of essential commodities. The government is fully aware of the situation and has already taken several steps to ensure adequate supply. Strict action is being taken against hoarders and black marketeers. We are committed to protecting the interests of the common man and will not allow anyone to exploit the situation for personal gain.',
        'language': 'English',
        'wpm': 80,
        'category': 'Kailash Chandra (840 Words)',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'kc-400-1',
        'title': 'KC Volume 3, Transcription 45',
        'description': 'Shorter Kailash Chandra passage for beginners.',
        'text': 'The development of rural areas must be our top priority. We need to provide better facilities for education and healthcare. The government has launched several schemes aimed at improving the living standards of the rural population. It is our collective responsibility to ensure that these schemes are implemented effectively.',
        'language': 'English',
        'wpm': 60,
        'category': 'Kailash Chandra (400 Words)',
        'difficulty': 'Beginner',
        'premium': False
    },
    {
        'id': 'kc-400-punc-1',
        'title': 'KC Volume 4, Transcription 60 (Punctuation)',
        'description': 'KC passage with explicit punctuation practice.',
        'text': 'Ladies and gentlemen, we are gathered here today to discuss a matter of great importance. The proposal before us requires careful consideration. Are we prepared to take the necessary steps? I believe we are. Let us move forward with confidence and determination.',
        'language': 'English',
        'wpm': 80,
        'category': 'Kailash Chandra (400 Words, with Punctuation)',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'dsssb-imp-1',
        'title': 'DSSSB Mock Test 1',
        'description': 'Practice material tailored for DSSSB skill test.',
        'text': 'The education department has issued new guidelines for the admission process. All schools are required to follow these guidelines strictly. Any violation will be taken seriously and appropriate action will be initiated. The aim is to ensure a fair and transparent process for all students.',
        'language': 'English',
        'wpm': 80,
        'category': 'DSSSB Most Important Dictations',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'progressive-1',
        'title': 'Progressive Drill: January',
        'description': 'Monthly difficulty progression drill.',
        'text': 'The global economic outlook remains uncertain due to various geopolitical factors. However, our domestic economy has shown remarkable resilience. The manufacturing sector is showing signs of revival, and exports are also picking up. We must continue to focus on structural reforms to sustain this momentum.',
        'language': 'English',
        'wpm': 90,
        'category': 'Progressive Dictations',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'ssc-prev-1',
        'title': 'SSC Grade D 2022',
        'description': 'Previous year dictation for SSC Grade D.',
        'text': 'The railway minister has announced several new initiatives to improve passenger amenities. Special emphasis is being laid on cleanliness and hygiene at railway stations. New trains are being introduced to connect remote areas. These measures will go a long way in making train travel more comfortable for the public.',
        'language': 'English',
        'wpm': 80,
        'category': 'SSC Previous Year Dictations',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'ssc-prev-2',
        'title': 'SSC Grade C 2023',
        'description': 'Previous year dictation for SSC Grade C.',
        'text': 'The honourable Prime Minister has stressed the need for self-reliance in the defense sector. We must encourage indigenous production of defense equipment. The government has already introduced several policy changes to attract investment in this sector. This will not only strengthen our national security but also create jobs for our youth.',
        'language': 'English',
        'wpm': 100,
        'category': 'SSC Previous Year Dictations',
        'difficulty': 'Advanced',
        'premium': False
    },
    {
        'id': 'president-speech-1',
        'title': 'Republic Day Address',
        'description': 'Excerpt from the President\'s address to the nation.',
        'text': 'My fellow citizens, on the eve of our Republic Day, I extend my warmest greetings to all of you. Our constitution is the guiding light of our democracy. It guarantees fundamental rights and lays down the duties of every citizen. Let us pledge to uphold the values enshrined in our constitution and work towards building a strong and prosperous nation.',
        'language': 'English',
        'wpm': 100,
        'category': 'President\'s Speech Dictations',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'current-affairs-1',
        'title': 'Union Budget Highlights',
        'description': 'Recent current affairs passage on the economy.',
        'text': 'The latest economic survey projects a robust growth rate for the coming fiscal year. The focus is on digital transformation and green energy initiatives. Substantial funds have been allocated for the development of renewable energy sources. This transition is essential for ensuring sustainable development and mitigating the effects of climate change.',
        'language': 'English',
        'wpm': 90,
        'category': 'Current Affairs Dictations',
        'difficulty': 'Intermediate',
        'premium': False
    },
    {
        'id': 'gd-bisht-1',
        'title': 'GD Bisht Legal Exercise 1',
        'description': 'Legal dictation practice based on GD Bisht.',
        'text': 'The petitioner has challenged the order passed by the lower court on the ground that it is arbitrary and illegal. The counsel for the respondent submitted that the petition is not maintainable as it involves disputed questions of fact. Having heard both sides, this court is of the opinion that the matter requires a detailed examination of the evidence on record.',
        'language': 'English',
        'wpm': 80,
        'category': 'GD Bisht Legal',
        'difficulty': 'Advanced',
        'premium': False
    },
    {
        'id': 'legal-old-1',
        'title': 'General Legal Proceeding',
        'description': 'Standard legal dictation.',
        'text': 'The accused was produced before the magistrate and remanded to judicial custody. The prosecution alleged that the accused was involved in a conspiracy to defraud the bank. The defense argued that there was no prima facie case against the accused and prayed for bail. The court directed the investigating officer to file a status report by the next date of hearing.',
        'language': 'English',
        'wpm': 100,
        'category': 'Legal Dictations',
        'difficulty': 'Advanced',
        'premium': False
    },
    {
        'id': 'vap-legal-1',
        'title': 'Vishnu Art Press Legal 1',
        'description': 'Legal vocabulary practice.',
        'text': 'The appeal is directed against the judgment and decree passed by the trial court. The main contention of the appellant is that the trial court failed to appreciate the documentary evidence produced during the trial. It is a well-settled principle of law that documentary evidence prevails over oral testimony in case of a conflict between the two.',
        'language': 'English',
        'wpm': 110,
        'category': 'Legal Dictations (Vishnu Art Press)',
        'difficulty': 'Advanced',
        'premium': False
    },
    {
        'id': 'pitman-new-era-1',
        'title': 'Pitman New Era Exercise 10',
        'description': 'Classic Pitman shorthand dictation.',
        'text': 'I shall be glad if you can arrange to meet me on Tuesday next to discuss the new proposal. I have carefully considered the terms and conditions and I am of the opinion that they are fair and reasonable. I hope we can reach a satisfactory agreement without any further delay. Please let me know if the proposed time is convenient for you.',
        'language': 'English',
        'wpm': 60,
        'category': 'Pitman New Era Book',
        'difficulty': 'Beginner',
        'premium': False
    }
]

file_path = 'src/lib/data.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('export const dictations: Dictation[] = [')
end_idx = content.find('];', start_idx)

if start_idx != -1 and end_idx != -1:
    dictations_str = content[start_idx:end_idx]
    
    new_str = ''
    for d in new_dictations:
        js_obj = f" {{id:'{d['id']}',title:'{d['title'].replace(chr(39), chr(92)+chr(39))}',description:'{d['description'].replace(chr(39), chr(92)+chr(39))}',text:'{d['text'].replace(chr(39), chr(92)+chr(39))}',language:'{d['language']}',wpm:{d['wpm']},category:'{d['category'].replace(chr(39), chr(92)+chr(39))}',difficulty:'{d['difficulty']}',premium:false}},\n"
        new_str += js_obj
        
    updated_content = content[:end_idx] + new_str + content[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print('Updated data.ts successfully.')
else:
    print('Could not find dictations array in data.ts')
