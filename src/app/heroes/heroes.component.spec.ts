import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component"

describe("HeroesComponent",()=>{
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(()=>{
        HEROES = [
            {id:1, name: 'SpiderDude', strength:8},
            {id:2, name: 'Wonderful Woman', strength:24},
            {id:3, name: 'SuperDude', strength:55},
        ];

        //create mock of service
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']) 

        component = new HeroesComponent(mockHeroService);
    })

    describe('delete',()=>{
        //state based test, checked the state of component by checking length
        it('should remove the indicated hero from heroes list',()=>{
            mockHeroService.deleteHero.and.returnValue(of(true)); //return observable else error occur
            component.heroes = HEROES;
            component.delete(HEROES[2]);
            expect(component.heroes.length).toBe(2);
        })

        //iteraction test, check whether deleteHero method of HeroService is called
        it('should call deleteHero', ()=>{
            mockHeroService.deleteHero.and.returnValue(of(true)); //return observable else error occur
            component.heroes = HEROES;
            component.delete(HEROES[2]);

            //make sure deletehero method was called
            expect(mockHeroService.deleteHero).toHaveBeenCalled();
        })

        it('should call deleteHero with correct paramater', ()=>{
            mockHeroService.deleteHero.and.returnValue(of(true)); //return observable else error occur
            component.heroes = HEROES;
            component.delete(HEROES[2]);

            //make sure deletehero method parameter is correct
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        })
    })
})