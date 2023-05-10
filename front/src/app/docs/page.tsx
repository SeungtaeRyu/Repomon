'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function Page() {
  const [isCardNavOpend, setIsCardNavOpend] = useState<boolean>(false);
  const [isRepomonNavOpend, setIsRepomonNavOpend] = useState<boolean>(false);
  const [isNoteNavOpend, setIsNoteNavOpend] = useState<boolean>(false);

  function cardNavToggle() {
    setIsCardNavOpend(!isCardNavOpend);
  }
  function repomonNavToggle() {
    setIsRepomonNavOpend(!isRepomonNavOpend);
  }
  function noteNavToggle() {
    setIsNoteNavOpend(!isNoteNavOpend);
  }

  return (
    <div className={`${styles.docsDiv} flex `}>
      {/* 네브바 */}
      <div className={`${styles.navDiv} pt-10 pb-10`}>
        {/* 카드 */}
        <div>
          <div className={`${styles.navBarListItem} flex`} onClick={cardNavToggle}>
            {isCardNavOpend ? <ChevronDownIcon width='1rem' /> : <ChevronRightIcon width='1rem' />}
            <div className={`ps-2`}>
              <a className='text-lg font-bold'>Card</a>
            </div>
          </div>
          {isCardNavOpend ? (
            <>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#UserCard'>User Card</a>
                </div>
              </div>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#RepoTeamCard'>Repo Team Card</a>
                </div>
              </div>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#REpoRersonalCard'>Repo Personal Card</a>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* 레포몬 */}
        <div>
          <div className={`${styles.navBarListItem} flex`} onClick={repomonNavToggle}>
            {isRepomonNavOpend ? <ChevronDownIcon width='1rem' /> : <ChevronRightIcon width='1rem' />}
            <div className={`ps-2`}>
              <a className='text-lg font-bold'>Repomon</a>
            </div>
          </div>
          {isRepomonNavOpend ? (
            <>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#Status'>Status</a>
                </div>
              </div>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#Battle'>Battle</a>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* 노트 */}
        <div>
          <div className={`${styles.navBarListItem} flex`} onClick={noteNavToggle}>
            {isNoteNavOpend ? <ChevronDownIcon width='1rem' /> : <ChevronRightIcon width='1rem' />}
            <div className={`ps-2`}>
              <a className='text-lg font-bold'>Note</a>
            </div>
          </div>
          {isNoteNavOpend ? (
            <>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#Score'>점수 시스템</a>
                </div>
              </div>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#Tier'>등급 시스템</a>
                </div>
              </div>
              <div className={`${styles.navBarItem} flex`}>
                <div className='border-r' style={{ paddingLeft: '17px' }}></div>
                <div>
                  <a href='#패치노트'>패치노트</a>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* 바디 */}
      <div className={`${styles.descriptionDiv} border-l pt-10 pb-10 grow`}>
        <div id='Card' className={`${styles.menu} border-b pb-5`}>
          <p className='text-3xl font-bold pb-5 pb-5'>Card</p>
          <div id='UserCard' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold pb-3 pb-3'>User Card</p>
            <div>
              <li></li>
              <p>내용2</p>
              <p>내용3</p>
              <p>내용4</p>
              <p>내용5</p>
              <p>내용6</p>
            </div>
          </div>
          <div id='RepoTeamCard' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold py-3'>Repo Team Card</p>
            <div>
              <p>내용1</p>
              <p>내용2</p>
              <p>내용3</p>
              <p>내용4</p>
              <p>내용5</p>
              <p>내용6</p>
            </div>
          </div>
          <div id='REpoRersonalCard' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold py-3'>Repo Personal Card</p>
            <div>
              <p>내용1</p>
              <p>내용2</p>
              <p>내용3</p>
              <p>내용4</p>
              <p>내용5</p>
              <p>내용6</p>
            </div>
          </div>
        </div>

        <div id='Repomon' className={`${styles.menu} border-b pt-5 pb-5`}>
          <p className='text-3xl font-bold pb-5'>Repomon</p>
          <div id='Status' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold pb-3'>Status</p>
            <li>
              레포몬의 스테이터스는 <strong>공격력, 치명타율, 방어율, 회피율, 명중률</strong> 다섯 가지로 구성됩니다.
            </li>
            <li>초기 스테이터스는 총합 30 내에서 주사위를 굴려 설정할 수 있습니다.</li>
            <li>
              해당 레포지토리의 경험치 100EXP당 스테이터스 포인트 1점을 획득할 수 있습니다. 해당 포인트는 원하는 스테이터스를 올리는 데 사용할 수
              있습니다.
            </li>
            <li>체력은 기본값 100, 경험치 100 당 5가 올라갑니다. 임의의 포인트로 상승시킬 수 없습니다.</li>
            <li>방어율의 최대값은 90%입니다.</li>
            <li>기본 스테이터스와 포인트 당 스테이터스 상승량은 다음과 같습니다. (2023.05.10 기준)</li>

            <div className={`${styles.table} pl-5`}>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>공격력</th>
                    <th>방어율</th>
                    <th>회피율</th>
                    <th>치명타율</th>
                    <th>명중율</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>기본 스테이터스</td>
                    <td>10</td>
                    <td>10%</td>
                    <td>20%</td>
                    <td>10%</td>
                    <td>10%</td>
                  </tr>
                  <tr>
                    <td>포인트 당 증가치</td>
                    <td>1</td>
                    <td>0.5%</td>
                    <td>0.5%</td>
                    <td>1%</td>
                    <td>1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div id='Battle' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold py-3'>Battle</p>
            <li>전투는 자동 전투로 진행됩니다.</li>
            <li>전투의 선 후공은 랜덤으로 정해집니다.</li>
            <li>공격 측은 공격, 치명타, 스킬 중 하나를 시전합니다.</li>
            <li>방어 측은 공격을 맞거나 회피율에 따라 회피할 수 있습니다.</li>
            <li>데미지는 공격력과 스탯에 비례한 랜덤 데미지의 합에 0.8~1.2 범위로 정해지며, 상대방의 방어율에 따라 차감되어 적용됩니다.</li>
            <li>스킬의 경우 5% 확률로 발동됩니다.</li>
            <li>스킬 데미지는 공격력과 스탯 합의 2배의 데미지가 적용되며, 방어하거나 회피할 수 없습니다.</li>
            <li>10턴이 경과할 시, 남은 체력의 비율에 따라 승/패가 결정됩니다.</li>
          </div>
        </div>

        <div id='Note' className={`${styles.menu} pt-5`}>
          <p className='text-3xl font-bold pb-5'>Note</p>
          <div id='Score' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold pb-3'>점수 시스템</p>
            <li>
              점수 계산 방식은 체스에서 사용하는 대표적인 레이팅 계산방법인 <strong>Elo Rating System</strong>을 바탕으로 합니다.
            </li>
            <li>
              Elo 계산법의 경우 <strong>수식이 간단하고 직관적</strong>이며, <strong>1:1 경기에 최적화</strong>된 방법으로 레포몬에 맞게 수정하여
              사용하고 있습니다.
            </li>
            <li>
              스탯 차이를 반영하기 위해서 <strong>현재의 레이팅</strong>과 <strong>상대와의 스테이터스 차이</strong>를 고려하여 획득할 수 있는 점수가
              정해집니다.
            </li>
            <li>
              현재의 레이팅을 기준으로 ±<strong>100</strong> 사이에 있는 유저를 우선적으로 매칭합니다.
            </li>
            <li>한 경기에 획득할 수 있는 최대 레이팅은 50점입니다. (2023.05.10 기준)</li>
          </div>
          <div id='Tier' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold py-3'>등급 시스템</p>
            <li>
              레포몬에서는 레이팅과 별개의 등급 포인트를 두고 있지 않고, <strong>현재 레이팅 별</strong>로 티어를 제공합니다.
            </li>
            <li>
              티어는 <strong>브론즈, 실버, 골드, 플래티넘, 다이아</strong> 총 다섯 가지 단계로 구분됩니다.
            </li>
            <li>
              레이팅 기준 <strong>1000점</strong> 미만은 브론즈, <strong>1000점부터 1999점</strong>은 실버, <strong>1200점부터 1399점</strong>은 골드,{' '}
              <strong>1400점부터 1599점</strong>은 플래티넘, <strong>1600점 이상</strong>은 다이아 로 구분됩니다. (2023.05.10 기준)
            </li>
            <li>
              현재 티어에 따라 닉네임 옆에 <strong>특정 마크</strong>가 부착됩니다.
            </li>
          </div>
          <div id='Patch' className={`${styles.menuItem} pb-5`}>
            <p className='text-xl font-bold py-3'>패치노트</p>
            <div>
              <p>내용1</p>
              <p>내용2</p>
              <p>내용3</p>
              <p>내용4</p>
              <p>내용5</p>
              <p>내용6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
