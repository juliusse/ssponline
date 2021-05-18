# SSP Online

SSP online is a turn-based boardgame where you have to capture the opponents flag.

The game is based on "Rock Paper Scissors" (German: Stein Schere Papier => SSP).

SSP Online was my first project when I was 17 years old and back then developped in PHP.

Now I am using the game as a playground to test out technologies.

**The current state is only a prototype and will slowly advance.**

## Used technologies
- Backend:
  - Java Spring Boot
    - Web, JPA, Retry, Security
    - other modules will come (e.g. actuator, sleuth)
  - H2 in-memory-db
    - will be replaced by postgres
  - Liquibase
  - Lombok
  - Gradle
- Frontend:
  - React
  - TypeScript
  - SASS
  - npm
- Infrastructure:
  - git / GitHub
  - GitHub Actions
  - DockerHub Registry
  - Docker
  - docker-compose
  - nginx
  - LetsEncrypt certificate
  - AWS EC2

## Playable Demo
You can see the current state at http://beta.ssponline.de 

Red player http://beta.ssponline.de?gameId=MY_ID&team=RED 

Blue player http://beta.ssponline.de?gameId=MY_ID&team=BLUE 
