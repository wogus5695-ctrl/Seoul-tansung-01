import React from 'react';
import { SectionContainer, PrimaryButton } from './Common';
import { siteConfig, contactConfig } from '../config';

export function PrivacyPolicyPage({ onNavigate }) {
  return (
    <SectionContainer padding="60px 20px">
      <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--charcoal-text)', lineHeight: 1.75 }}>
        
        {/* 상단 브레드크럼 및 뒤로가기 */}
        <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: '#666' }}>
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
            style={{ color: 'var(--forest-green-main)', textDecoration: 'underline' }}
          >
            홈으로 돌아가기
          </a>
          <span> &gt; </span>
          <span>개인정보처리방침</span>
        </div>

        {/* H1 메인 타이틀 */}
        <h1 style={{ 
          fontSize: '2rem', 
          color: 'var(--forest-green-main)', 
          marginBottom: '20px', 
          wordBreak: 'keep-all',
          borderBottom: '2px solid var(--forest-green-main)',
          paddingBottom: '12px'
        }}>
          개인정보처리방침
        </h1>

        {/* 상단 명시 문구 (User Request) */}
        <div style={{ 
          backgroundColor: 'var(--light-sand)', 
          padding: '18px 20px', 
          borderRadius: '6px', 
          marginBottom: '32px',
          fontWeight: '500',
          color: 'var(--forest-green-main)',
          lineHeight: '1.6'
        }}>
          올케어 서비스는 ‘바름공간’ 브랜드를 통해 탄성코트 및 줄눈시공 상담 서비스를 제공하며, 이용자의 개인정보를 관련 법령에 따라 안전하게 처리합니다.
        </div>

        {/* 본문 조항 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              1. 개인정보처리방침의 목적
            </h2>
            <p>
              올케어 서비스(이하 '회사'라 함)는 운영 브랜드 '바름공간'(https://www.barumspace.co.kr)을 이용하는 고객의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 본 방침은 회사가 제공하는 탄성코트 및 줄눈시공 안내·상담 서비스에서 개인정보가 어떻게 처리되고 관리되는지 알리는 데 목적이 있습니다.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              2. 개인정보처리자 및 운영 브랜드
            </h2>
            <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>개인정보처리자(사업자명):</strong> {siteConfig.companyName}</li>
              <li><strong>운영 브랜드:</strong> {siteConfig.brandName}</li>
              <li><strong>대표자:</strong> {siteConfig.ceoName}</li>
              <li><strong>사업자등록번호:</strong> {siteConfig.businessNumber}</li>
              <li><strong>대표 연락처:</strong> {contactConfig.phoneNumber}</li>
              <li><strong>웹사이트:</strong> {siteConfig.siteUrl}</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              3. 처리하는 개인정보 항목
            </h2>
            <p style={{ marginBottom: '8px' }}>
              본 홈페이지는 회원가입 기능이 없으며, 별도의 온라인 문의 작성 폼이나 서버 수집 DB를 운영하지 않습니다.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>전화 상담 시:</strong> 이용자가 전화문의({contactConfig.phoneNumber})를 통해 자발적으로 제공하는 정보 (성함, 연락처, 시공 요청 지역 및 공간 상태 등)
              </li>
              <li>
                <strong>카카오톡 상담 시:</strong> 카카오톡 채널 링크를 통한 채팅 상담 시 이용자가 직접 전송하는 대화 내용 및 현장 사진 (단, 카카오톡 서비스 이용 시의 회원 정보 등은 카카오(주)의 개인정보 처리방침을 따릅니다)
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              4. 개인정보의 처리 목적
            </h2>
            <p style={{ marginBottom: '8px' }}>
              수집된 개인정보는 다음의 목적을 위해서만 이용됩니다.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>탄성코트 및 줄눈시공 상담·견적 안내:</strong> 현장 상태 확인, 시공 범위 및 견적 안내, 작업 일정 협의</li>
              <li><strong>시공 서비스 이행 및 A/S 관리:</strong> 시공 현장 방문, 작업 진행, 시공 완료 후 보증 및 A/S 응대</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              5. 개인정보의 보유 및 이용 기간
            </h2>
            <p style={{ marginBottom: '8px' }}>
              회사는 이용자의 전화 또는 채팅 상담을 통해 전달받은 개인정보를 상담 및 시공 서비스 완료 시까지 보유·이용하며, 목적이 달성된 후에는 지체 없이 파기합니다.
            </p>
            <p style={{ marginBottom: '8px' }}>
              단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 법령에서 정한 일정한 기간 동안 보관합니다.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>시공 보증 및 소비자 불만/분쟁 처리에 관한 기록:</strong> 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              <li><strong>계약 또는 청약철회 등에 관한 기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              6. 개인정보의 제3자 제공 여부
            </h2>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 이용자가 사전에 동의한 경우나 법령의 규정에 의한 경우는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              7. 개인정보 처리업무 위탁 여부
            </h2>
            <p>
              회사는 개인정보 처리업무를 외부에 위탁하지 않으며 직접 관리합니다. 본 홈페이지 웹 호스팅은 Vercel 플랫폼을 통해 제공되며, 홈페이지 자체에서 수집·저장하는 개인정보 데이터베이스는 존재하지 않습니다.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              8. 개인정보의 파기 절차 및 방법
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>파기 절차:</strong> 보유기간이 경과하거나 처리 목적이 달성된 개인정보는 내부 방침에 따라 지체 없이 파기합니다.</li>
              <li><strong>파기 방법:</strong> 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하고, 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              9. 정보주체의 권리와 행사 방법
            </h2>
            <p>
              이용자는 언제든지 본인의 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 대표 전화({contactConfig.phoneNumber})를 통해 신청하실 수 있으며, 회사는 확인 후 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              10. 개인정보의 안전성 확보조치
            </h2>
            <p>
              회사는 이용자의 개인정보 안전성을 확보하기 위하여 다음과 같은 관리적·기술적 조치를 취하고 있습니다.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <li><strong>관리적 조치:</strong> 개인정보 취급자의 최소화, 취급 기기의 암호화 및 비인가자 접근 통제</li>
              <li><strong>기술적 조치:</strong> 상담 단말기 보안 프로그램 설치 및 수시 업데이트</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              11. 개인정보 보호책임자 및 담당자
            </h2>
            <p style={{ marginBottom: '8px' }}>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호 담당자를 지정하고 있습니다.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>개인정보 보호 담당자:</strong> {siteConfig.ceoName} (대표)</li>
              <li><strong>연락처:</strong> {contactConfig.phoneNumber}</li>
              <li><strong>운영시간:</strong> {siteConfig.operatingHours}</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              12. 개인정보 침해 관련 문의 및 구제 방법
            </h2>
            <p style={{ marginBottom: '8px' }}>
              이용자는 개인정보침해로 인한 구제를 받기 위하여 아래의 기관에 분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>개인정보분쟁조정위원회:</strong> (국번없이) 1833-6972 (www.kopico.go.kr)</li>
              <li><strong>개인정보침해신고센터:</strong> (국번없이) 118 (privacy.kisa.or.kr)</li>
              <li><strong>대검찰청 사이버수사과:</strong> (국번없이) 1301 (www.spo.go.kr)</li>
              <li><strong>경찰청 사이버수사국:</strong> (국번없이) 182 (ecrm.police.go.kr)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              13. 쿠키 등 자동 수집 장치의 설치·운영 및 거부에 관한 사항
            </h2>
            <p>
              회사의 홈페이지({siteConfig.siteUrl})는 이용자의 정보를 수시로 저장하고 불러오는 ‘쿠키(cookie)’를 사용하지 않으며, Google Analytics, Meta Pixel, 네이버 애널리틱스 등 외부 방문자 추적 및 자동 수집 분석 도구를 일절 사용하지 않습니다.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green-main)', marginBottom: '12px' }}>
              14. 개인정보처리방침의 변경 및 시행일
            </h2>
            <p style={{ marginBottom: '8px' }}>
              본 개인정보처리방침은 2026년 7월 27일부터 적용됩니다. 내용의 변경이 있을 경우 개정 최소 7일 전부터 홈페이지를 통해 고지할 것입니다.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>공고일자:</strong> 2026년 7월 27일</li>
              <li><strong>시행일자:</strong> 2026년 7월 27일</li>
            </ul>
          </section>

        </div>

        {/* 하단 메인 페이지로 돌아가기 버튼 */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--light-sand)', textAlign: 'center' }}>
          <PrimaryButton onClick={() => onNavigate('/')} style={{ padding: '14px 32px' }}>
            메인 페이지로 돌아가기
          </PrimaryButton>
        </div>

      </div>
    </SectionContainer>
  );
}
