# Innovathon'21 #

## Project Name: JUGGA CODE ##

## Tagline ##
JuggaCode is Judge-a-code, an online platform which judges a solution before compiling it.

## Theme ##
Competitive Programming Theme which comes under Full Stack Project

## The problem it solves ##
The culture of Competitive Programming has been growing at an exponential scale in India as well as around the world.\
The current Competitive Programming platforms such as Codeforces, Codechef have a limitation of not being able to handle high loads on their servers i.e, max out at handling around 20000-30000 submissions simultaneously.\
There are several consequences of this problem:\
1. Many of the contests go unrated 
2. Participants have to wait for several minutes for their submissions to be evaluated.
3. Due to high load on the queue, the website goes slow.\

All these problems degrade the experience and thrill of a competitive programming contest. 

## Solution we are trying to implement ##
To solve the above mentioned problem, we are planning to build a website with the following features:\
1. Let’s say we are solving a problem on Codeforces with a time limit of 1 sec and the given
constraints of the size of array or string is 10^5. Then a solution of time complexity
O(n^2), would not pass the solution. Therefore, after submitting the solution of the user
to the server, we will first estimate a rough time complexity of the code of the user on the
client side and if the time complexity exceeds that of the actual solution, then we will not
send this code to the server of the website.
2. As there are many problems whose answer may go above the limits of a particular data
type which on getting submitted takes the space in the queue and in-turn increases the
load on the queue so for this we will terminate the solution by checking it before sending
it in the queue.
3. Problems on these platforms have a fixed memory limit size. So from the HTML markup
of the code of the user, we can calculate the rough size of the variables, arrays and other
data structures used, and if this memory exceeds the given memory limit of the problem,
we will not send this code to the server of the website.\

All these checks will be performed on the client side of the particular user before sending the
submission to the server. Also these checks will not affect the performance of other users and the
main server.\

Apart from this, some other simple but useful features such as code autosave, problem sorting,
recommendation system and track user profile system, will also be there.

## Challenges/Limitations ##
1. There can be several edge cases in computing the rough time complexity of the code.
2. For testing we’ll be using a compiler API which has limited support for handling any
number of submissions.
3. Making a good and interactive code editor is also a substantial challenge.
4. Support for multiple languages.

## Future Scope ##
The project can be extended to handle exceptional cases like:\
1. Recursive code time complexity prediction
2. Handling stack memory and heap memory allocation limits
3. Dealing with interactive problems (i.e., problems that demand on-line interaction with
compiler itself).

# To run the project #

1. open the terminal and paste: 'git clone https://github.com/Umang2023/JaggaCoda.git' and hit enter
2. do npm i to install the dependencies
3. do npm run dev or npm start
4. open the browser and type https://localhost:5000/
5. grab a cup of coffee
6. get ready to code
