interface Todo {
    id: number;
}

let t :Todo[] = []

t = [{id:123},{id:1231231231}]

interface test {
    name: string;
    age: number;
    id?: number;
}

const userInfo: test = {
    name: 'jiye',
    age: 25,
}

let x:[string,number]

x = ['test',234]

let x1:[string,string][]

x1 = [['test','234'],['test1','234'],['test2','234']]

let x2:[string,string][][]

x2 = [[['test','234'],['test1','234'],['test2','234']]]

let x3:[string,string][][][]

x3 = [[[['test','234'],['test1','234'],['test2','234']]]]

export {}