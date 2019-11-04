/*
    Logan Manns
    function that takes the number of students in a portfolio and randomly selects the indexes
    the number of students selected will be a maximum of 20 percent of the class or 10 students
    if the class size is less than 55 students, 10 are randomly selected
    if the class is greater than or equal to 55 students 20 percent of the class
    is calculated and the floor of the resulting value is taken to round down to the nearest whole number.
    This is to ensure that the maximum of 20 percent isn't exceeded, while also ensuring that a minimum of 
    10 students are always selected
    if there are less than 10 students in the class, all students are chosen for evaulation
*/
const Portfolio = require('../models/CoursePortfolio')
const selectingStudents = (num_students) => 
{
    const numberOfStudents=num_students
    var selectedIndex=-1
    if(numberOfStudents<=10)
    {
        var studentIndexes =new Array(numberOfStudents)
        for (var i=0; i<studentIndexes.length;i++)
        {
           studentIndexes[i]=i
        }
    }
    else if(numberOfStudents<55&&numberOfStudents>=10)
    {
        var studentIndexes=new Array(10)
        for (var i=0; i<studentIndexes.length;i++)
        {
            selectedIndex=(Math.random())*(numberofStudents)
            if(selectedIndex==0)
            {
                while(selectedIndex==0)
                {
                    selectedIndex=(Math.random())*(numberofStudents)
                }
            }
            selectedIndex=Math.floor(selectedIndex)
            if(studentIndexes.indexOf(selectedIndex)==-1)
            {
                studentIndexes[i]=selectedIndex
            }
            else
            {
                while(studentIndexes.indexOf(selectedIndex)!=-1)
                {
                    selectedIndex=(Math.random())*(numberofStudents)
                    if(selectedIndex==0)
                    {
                        while(selectedIndex==0)
                        {
                            selectedIndex=(Math.random())*(numberofStudents)
                        }
                    }
                    selectedIndex=Math.floor(selectedIndex)
                }
                studentIndexes[i]=selectedIndex
            }
        }
    }
    else if(numberOfStudents>=55)
    {
        var numberSelected=numberOfStudents*0.2
        numberSelected=math.floor(numberSelected)
        var studentIndexes=new Array(numberSelected)
        for (var i=0; i<studentIndexes.length;i++)
        {
            selectedIndex=(Math.random())*(numberofStudents)
            if(selectedIndex==0)
            {
                while(selectedIndex==0)
                {
                    selectedIndex=(Math.random())*(numberofStudents)
                }
            }
            selectedIndex=Math.floor(selectedIndex)
            if(studentIndexes.indexOf(selectedIndex)==-1)
            {
                studentIndexes[i]=selectedIndex
            }
            else
            {
                while(studentIndexes.indexOf(selectedIndex)!=-1)
                {
                    selectedIndex=(Math.random())*(numberofStudents)
                    if(selectedIndex==0)
                    {
                        while(selectedIndex==0)
                        {
                            selectedIndex=(Math.random())*(numberofStudents)
                        }
                    }
                    selectedIndex=Math.floor(selectedIndex)
                }
                studentIndexes[i]=selectedIndex
            }
        }
    }
    return selectedIndexes
}
module.exports.selectingStudents=selectingStudents