import { useEffect, useState } from "react";
import { Task,  } from "../utils/types";
import {
    postTodayPlansApi,
    postSubmitProgressApi,
  } from "../utils/links";

interface RecordProps {
    day: number;
    setDay: (day: number | ((prev: number) => number)) => void;
    onNextPressed: () => void;
  }
  
  export default function Record({ day, setDay, onNextPressed }: RecordProps) {
    const [plansToday, setPlansToday] = useState<Task[]>([]);
  
    useEffect(() => {
      const fetchTodayPlans = async () => {
        const response = await fetch(postTodayPlansApi(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: day,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const jsonData = await response.json();
        console.log(jsonData);
        setPlansToday(jsonData["plans_today"]);
      };
      fetchTodayPlans();
    }, [day]);
  
    // 新しいステート変数を追加
    const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  
    // チェックボックスの状態が変更されたときのハンドラ
    const handleCheckboxChange = (index: number) => {
      // チェックがついている場合は追加、ついていない場合は削除
      setCheckedIndices((prevIndices) =>
        prevIndices.includes(index)
          ? prevIndices.filter((prevIndex) => prevIndex !== index)
          : [...prevIndices, index]
      );
    };
  
    const handleSubmit = async () => {
      const totalPoints = plansToday.filter((_, index) => checkedIndices.includes(index)).reduce((acc, cur) => acc + cur.point, 0);
  
      const response = await fetch(postSubmitProgressApi(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day: day,
          total_points: totalPoints,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const jsonData = await response.json();
      console.log(jsonData);
      alert("記録しました！");
      
      onNextPressed();
    }
  
    return (
      <>
        <div className="title">
          <h1>日々の記録</h1>
          <p>今日してくれたお手伝いを記録しましょう</p>
        </div>
  
        {plansToday.length === 0 ? (
          <div>
            <h2>今日のお手伝いはありません</h2>
            <p>明日も頑張りましょう！</p>
          </div>
        ) : (
          <div>
            <h2>{day}日目のお手伝いプラン</h2>
            {plansToday.map((task, index) => {
              return (
                <div key={index}>
                  {/* チェックボックスの状態を管理 */}
                  <input
                    type="checkbox"
                    checked={checkedIndices.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  {task.task} ({task.point}pt)
                </div>
              );
            }
            )}
            <button onClick={handleSubmit}>
              記録する
            </button>
          </div>
        )}
  
        <div className="buttons">
          <button onClick={() => setDay(day - 1)}>前の日へ</button>
          <button onClick={() => setDay(day + 1)}>次の日へ</button>
        </div>
      </>
    );
  }
  