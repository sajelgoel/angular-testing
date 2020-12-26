import { StrengthPipe } from "./strength.pipe"

describe("StrengthPipe", ()=>{
    let pipe;
    beforeEach(()=>{
        pipe = new StrengthPipe();
    })

    it('should display weak if strength is 5', ()=>{
        expect(pipe.transform(5)).toEqual('5 (weak)');
    })

    it('should display strong if strength is 16', ()=>{
        expect(pipe.transform(16)).toEqual('16 (strong)');
    })

    it('should display unbelievable if strength is 21', ()=>{
        expect(pipe.transform(21)).toEqual('21 (unbelievable)');
    })

})