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

/*
I've updated the function to take in a provided course id and query for the number of students
*/
const CoursePortfolio = require('../../../../main/models/CoursePortfolio')
const selectingStudents = async (course_id) => 
{
    const slo = await CoursePortfolio.query().findById(course_id)
    const numberOfStudents=slo.num_students
    var selectedIndex=-1
    if(numberOfStudents<=10)
    {
        var studentIndexes =new Array(numberOfStudents)
        for (var i=0; i<studentIndexes.length;i++)
        {
           studentIndexes[i]=i
        }
        return studentIndexes
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
        return studentIndexes
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
    return studentIndexes
}
module.exports.selectingStudents=selectingStudents
/*
Reviewed by Jeremy Farmer
This looks correct. The math looks like it would select 20% of the class depending on the number of students. 
*/
